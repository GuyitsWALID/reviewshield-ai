import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api-utils";
import { fetchGoogleReviews, getUserConnections } from "@/lib/gbp";
import type { Review, RiskLevel, ReviewStatus } from "@/lib/types";

function toRiskLevel(score: number): RiskLevel {
  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}

function scoreFromText(content: string): number {
  const low = content.toLowerCase();
  let score = 15;
  if (low.includes("scam")) score += 35;
  if (low.includes("never") || low.includes("worst")) score += 20;
  if ((content.match(/!/g) ?? []).length > 2) score += 15;
  return Math.min(score, 98);
}

function statusFromRisk(riskLevel: RiskLevel): ReviewStatus {
  if (riskLevel === "critical" || riskLevel === "high") return "pending";
  if (riskLevel === "medium") return "flagged";
  return "legitimate";
}

function avatarFromName(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "RV";
}

function toHumanDate(dateString?: string) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString();
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  const shouldSync = request.nextUrl.searchParams.get("sync") === "true";

  let reviews: Review[] = [];

  const { data: existingReviews } = await auth.supabase
    .from("reviews")
    .select("id,author_name,rating,comment,created_at,platform,location_name,risk_score,risk_level,status,detection_reason,account_id,location_id,google_review_id")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: verificationRows } = await auth.supabase
    .from("review_verifications")
    .select("review_id,is_known_customer,notes")
    .eq("user_id", auth.user.id);

  const verificationMap = new Map(
    (verificationRows ?? []).map((item) => [item.review_id, item])
  );

  reviews =
    existingReviews?.map((row) => {
      const verification = verificationMap.get(row.id);

      return {
      id: row.id,
      author: row.author_name ?? "Unknown",
      avatar: avatarFromName(row.author_name ?? "Unknown"),
      rating: Number(row.rating ?? 0),
      content: row.comment ?? "",
      date: toHumanDate(row.created_at),
      platform: row.platform ?? "Google",
      location: row.location_name ?? "Unknown Location",
      riskScore: Number(row.risk_score ?? 0),
      riskLevel: (row.risk_level as RiskLevel) ?? "low",
      status: (row.status as ReviewStatus) ?? "pending",
      detection: row.detection_reason ?? "No explanation available",
      accountId: row.account_id ?? undefined,
      locationId: row.location_id ?? undefined,
      googleReviewId: row.google_review_id ?? undefined,
      isKnownCustomer: verification?.is_known_customer ?? undefined,
      customerVerificationNotes: verification?.notes ?? undefined,
    };
    }) ?? [];

  if (shouldSync) {
    const connections = await getUserConnections(auth.user.id);

    for (const connection of connections) {
      const googleReviews = await fetchGoogleReviews(connection);

      for (const googleReview of googleReviews) {
        const content = googleReview.comment ?? "";
        const riskScore = scoreFromText(content);
        const riskLevel = toRiskLevel(riskScore);

        const mappedReview: Review = {
          id: `${connection.location_id}-${googleReview.reviewId}`,
          author: googleReview.reviewer?.displayName ?? "Google User",
          avatar: avatarFromName(googleReview.reviewer?.displayName ?? "Google User"),
          rating: Number(googleReview.starRating ?? 0),
          content,
          date: toHumanDate(googleReview.createTime),
          platform: "Google",
          location: connection.location_name ?? connection.location_id,
          riskScore,
          riskLevel,
          status: statusFromRisk(riskLevel),
          detection: "Google ingestion with heuristic risk scoring",
          accountId: connection.account_id,
          locationId: connection.location_id,
          googleReviewId: googleReview.reviewId,
        };

        reviews.push(mappedReview);

        await auth.supabase.from("reviews").upsert(
          {
            id: mappedReview.id,
            user_id: auth.user.id,
            author_name: mappedReview.author,
            rating: mappedReview.rating,
            comment: mappedReview.content,
            created_at: googleReview.createTime ?? new Date().toISOString(),
            platform: mappedReview.platform,
            location_name: mappedReview.location,
            risk_score: mappedReview.riskScore,
            risk_level: mappedReview.riskLevel,
            status: mappedReview.status,
            detection_reason: mappedReview.detection,
            account_id: mappedReview.accountId,
            location_id: mappedReview.locationId,
            google_review_id: mappedReview.googleReviewId,
          },
          { onConflict: "id" }
        );
      }
    }
  }

  reviews.sort((a, b) => b.riskScore - a.riskScore);

  return NextResponse.json({ reviews });
}

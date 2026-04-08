import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api-utils";
import { fetchGoogleReviews, getUserConnections } from "@/lib/gbp";
import {
  detectFakeReview,
  type DetectionReviewInput,
} from "@/lib/fake-review-detector";
import type { Review, ReviewStatus, RiskLevel } from "@/lib/types";

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

  const reviewsById = new Map<string, Review>();

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

  const historicalForDetection: DetectionReviewInput[] =
    existingReviews?.map((row) => ({
      id: row.id,
      author: row.author_name ?? "Unknown",
      rating: Number(row.rating ?? 0),
      content: row.comment ?? "",
      createdAt: row.created_at ?? new Date().toISOString(),
      platform: row.platform ?? "Google",
      location: row.location_name ?? "Unknown Location",
    })) ?? [];

  const storedReviews =
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

  for (const review of storedReviews) {
    reviewsById.set(review.id, review);
  }

  if (shouldSync) {
    const connections = await getUserConnections(auth.user.id);

    const alertRows: Array<{
      user_id: string;
      type: "suspicious";
      title: string;
      description: string;
      severity: "critical" | "high";
      review_id: string;
      read: boolean;
      created_at: string;
    }> = [];

    for (const connection of connections) {
      const googleReviews = await fetchGoogleReviews(connection);
      googleReviews.sort((a, b) => {
        const aTime = new Date(a.createTime ?? 0).getTime();
        const bTime = new Date(b.createTime ?? 0).getTime();
        return aTime - bTime;
      });

      for (const googleReview of googleReviews) {
        const content = googleReview.comment ?? "";
        const reviewId = `${connection.location_id}-${googleReview.reviewId}`;
        const createdAt = googleReview.createTime ?? new Date().toISOString();
        const locationName = connection.location_name ?? connection.location_id;

        const detection = detectFakeReview(
          {
            id: reviewId,
            author: googleReview.reviewer?.displayName ?? "Google User",
            rating: Number(googleReview.starRating ?? 0),
            content,
            createdAt,
            platform: "Google",
            location: locationName,
          },
          { recentReviews: historicalForDetection }
        );

        const mappedReview: Review = {
          id: reviewId,
          author: googleReview.reviewer?.displayName ?? "Google User",
          avatar: avatarFromName(googleReview.reviewer?.displayName ?? "Google User"),
          rating: Number(googleReview.starRating ?? 0),
          content,
          date: toHumanDate(createdAt),
          platform: "Google",
          location: locationName,
          riskScore: detection.riskScore,
          riskLevel: detection.riskLevel,
          status: detection.status,
          detection: detection.detectionReason,
          accountId: connection.account_id,
          locationId: connection.location_id,
          googleReviewId: googleReview.reviewId,
        };

        reviewsById.set(mappedReview.id, mappedReview);
        historicalForDetection.unshift({
          id: mappedReview.id,
          author: mappedReview.author,
          rating: mappedReview.rating,
          content: mappedReview.content,
          createdAt,
          platform: mappedReview.platform,
          location: mappedReview.location,
        });

        await auth.supabase.from("reviews").upsert(
          {
            id: mappedReview.id,
            user_id: auth.user.id,
            author_name: mappedReview.author,
            rating: mappedReview.rating,
            comment: mappedReview.content,
            created_at: createdAt,
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

        if (mappedReview.riskScore >= 65) {
          const severity = mappedReview.riskScore >= 85 ? "critical" : "high";
          alertRows.push({
            user_id: auth.user.id,
            type: "suspicious",
            title: "Suspicious review detected",
            description: `${mappedReview.author} posted a ${mappedReview.riskScore}% risk review at ${mappedReview.location}.`,
            severity,
            review_id: mappedReview.id,
            read: false,
            created_at: new Date().toISOString(),
          });
        }
      }
    }

    if (alertRows.length > 0) {
      await auth.supabase.from("alerts").insert(alertRows);
    }
  }

  const reviews = Array.from(reviewsById.values());
  reviews.sort((a, b) => b.riskScore - a.riskScore);

  return NextResponse.json({ reviews });
}

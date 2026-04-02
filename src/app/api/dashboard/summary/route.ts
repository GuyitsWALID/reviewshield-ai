import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api-utils";
import type { DashboardSummary, Review } from "@/lib/types";

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  const { data: rows } = await auth.supabase
    .from("reviews")
    .select("id,author_name,rating,comment,created_at,platform,location_name,risk_score,risk_level,status,detection_reason")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const reviews: Review[] =
    rows?.map((row) => ({
      id: row.id,
      author: row.author_name ?? "Unknown",
      avatar: (row.author_name ?? "U")
        .split(" ")
        .slice(0, 2)
        .map((part: string) => part[0]?.toUpperCase() ?? "")
        .join(""),
      rating: Number(row.rating ?? 0),
      content: row.comment ?? "",
      date: row.created_at ? new Date(row.created_at).toLocaleDateString() : "Unknown",
      platform: row.platform ?? "Google",
      location: row.location_name ?? "Unknown",
      riskScore: Number(row.risk_score ?? 0),
      riskLevel: row.risk_level ?? "low",
      status: row.status ?? "pending",
      detection: row.detection_reason ?? "No explanation available",
    })) ?? [];

  const totalReviews = reviews.length;
  const fakeDetected = reviews.filter((review) => review.riskScore >= 65).length;
  const removedSuccessfully = reviews.filter((review) => review.status === "reported").length;
  const avgRisk = totalReviews ? reviews.reduce((sum, review) => sum + review.riskScore, 0) / totalReviews : 0;
  const healthScore = Math.max(0, Math.min(100, Math.round(100 - avgRisk * 0.7)));

  const summary: DashboardSummary = {
    totalReviews,
    fakeDetected,
    removedSuccessfully,
    healthScore,
    recentReviews: reviews.slice(0, 5),
  };

  return NextResponse.json(summary);
}

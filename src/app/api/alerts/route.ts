import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api-utils";
import type { AlertItem } from "@/lib/types";

function timeAgo(dateString: string | null): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString).getTime();
  const now = Date.now();
  const hours = Math.max(1, Math.floor((now - date) / 3_600_000));
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  const { data: rows } = await auth.supabase
    .from("alerts")
    .select("id,type,title,description,severity,review_id,read,created_at")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (rows && rows.length > 0) {
    const alerts: AlertItem[] = rows.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      time: timeAgo(row.created_at),
      severity: row.severity,
      reviewId: row.review_id ?? undefined,
      read: Boolean(row.read),
    }));

    return NextResponse.json({ alerts });
  }

  const { data: riskyReviews } = await auth.supabase
    .from("reviews")
    .select("id,comment,risk_score,created_at")
    .eq("user_id", auth.user.id)
    .gte("risk_score", 65)
    .order("created_at", { ascending: false })
    .limit(5);

  const alerts: AlertItem[] =
    riskyReviews?.map((review) => ({
      id: `derived-${review.id}`,
      type: "suspicious",
      title: "Suspicious review detected",
      description: `High-risk review (${review.risk_score}%) requires attention: ${(review.comment ?? "").slice(0, 120)}`,
      time: timeAgo(review.created_at),
      severity: review.risk_score >= 85 ? "critical" : "high",
      reviewId: review.id,
      read: false,
    })) ?? [];

  return NextResponse.json({ alerts });
}

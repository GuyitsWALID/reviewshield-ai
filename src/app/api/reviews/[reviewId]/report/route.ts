import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api-utils";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  const auth = await requireUser(request);
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  const { reviewId } = await context.params;

  const { data: review } = await auth.supabase
    .from("reviews")
    .select("id,comment,risk_score,risk_level,detection_reason,location_name")
    .eq("id", reviewId)
    .eq("user_id", auth.user.id)
    .single();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const { data: verification } = await auth.supabase
    .from("review_verifications")
    .select("is_known_customer,notes")
    .eq("user_id", auth.user.id)
    .eq("review_id", review.id)
    .maybeSingle();

  const payload = {
    user_id: auth.user.id,
    review_id: review.id,
    status: "ready",
    generated_at: new Date().toISOString(),
    summary: {
      location: review.location_name,
      risk_score: review.risk_score,
      risk_level: review.risk_level,
      detection_reason: review.detection_reason,
      content_excerpt: (review.comment ?? "").slice(0, 250),
      known_customer: verification?.is_known_customer ?? null,
      verification_notes: verification?.notes ?? null,
    },
  };

  await auth.supabase.from("evidence_packages").insert(payload);

  await auth.supabase
    .from("reviews")
    .update({ status: "reported" })
    .eq("id", review.id)
    .eq("user_id", auth.user.id);

  return NextResponse.json({
    ok: true,
    message: "Evidence package generated",
    googleReportUrl: "https://support.google.com/business/gethelp",
  });
}

import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api-utils";
import { getUserConnections, replyToGoogleReview } from "@/lib/gbp";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  const auth = await requireUser(request);
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  const body = (await request.json()) as { message?: string };
  if (!body.message || body.message.trim().length < 5) {
    return NextResponse.json({ error: "Reply message is too short" }, { status: 400 });
  }

  const { reviewId } = await context.params;

  const { data: review } = await auth.supabase
    .from("reviews")
    .select("id,account_id,location_id,google_review_id")
    .eq("id", reviewId)
    .eq("user_id", auth.user.id)
    .single();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (!review.account_id || !review.location_id || !review.google_review_id) {
    return NextResponse.json(
      { error: "This review is not linked to Google Business Profile identifiers" },
      { status: 400 }
    );
  }

  const connections = await getUserConnections(auth.user.id);
  const connection = connections.find(
    (item) => item.account_id === review.account_id && item.location_id === review.location_id
  );

  if (!connection) {
    return NextResponse.json({ error: "No active Google connection for this location" }, { status: 400 });
  }

  await replyToGoogleReview({
    connection,
    googleReviewId: review.google_review_id,
    message: body.message.trim(),
  });

  await auth.supabase
    .from("reviews")
    .update({ owner_reply: body.message.trim(), status: "reported" })
    .eq("id", reviewId)
    .eq("user_id", auth.user.id);

  return NextResponse.json({ ok: true });
}

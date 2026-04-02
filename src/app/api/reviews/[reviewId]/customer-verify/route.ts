import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api-utils";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  const auth = await requireUser(request);
  if (auth.error || !auth.user) return auth.error!;

  const { reviewId } = await context.params;
  const payload = (await request.json()) as {
    isKnownCustomer: boolean;
    notes?: string;
  };

  const { data: review } = await auth.supabase
    .from("reviews")
    .select("id")
    .eq("id", reviewId)
    .eq("user_id", auth.user.id)
    .single();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const { error } = await auth.supabase.from("review_verifications").upsert(
    {
      user_id: auth.user.id,
      review_id: reviewId,
      is_known_customer: payload.isKnownCustomer,
      notes: payload.notes ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,review_id" }
  );

  if (error) {
    return NextResponse.json(
      {
        error:
          "Failed to save verification tag. Ensure review_verifications table exists with user_id+review_id unique index.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

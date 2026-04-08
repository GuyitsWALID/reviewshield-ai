import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api-utils";

interface SaveOnboardingPayload {
  action?: "save" | "complete_setup";
  businessName?: string;
  industry?: string;
  teamSize?: string;
  monthlyReviewVolume?: string;
  primaryGoal?: string;
  biggestChallenge?: string;
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error || !auth.user) return auth.error!;

  const { data: profile } = await auth.supabase
    .from("user_onboarding")
    .select(
      "business_name,industry,team_size,monthly_review_volume,primary_goal,biggest_challenge,onboarding_completed,setup_completed"
    )
    .eq("user_id", auth.user.id)
    .maybeSingle();

  const { count } = await auth.supabase
    .from("gbp_connections")
    .select("id", { count: "exact", head: true })
    .eq("user_id", auth.user.id);

  return NextResponse.json({
    profile: profile ?? null,
    connectedLocations: count ?? 0,
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error || !auth.user) return auth.error!;

  const payload = (await request.json()) as SaveOnboardingPayload;
  const action = payload.action ?? "save";

  if (action === "complete_setup") {
    const { error } = await auth.supabase.from("user_onboarding").upsert(
      {
        user_id: auth.user.id,
        setup_completed: true,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      return NextResponse.json({ error: "Failed to complete setup" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  const requiredFields = [
    payload.businessName,
    payload.industry,
    payload.teamSize,
    payload.monthlyReviewVolume,
    payload.primaryGoal,
  ];

  if (requiredFields.some((field) => !field || !field.trim())) {
    return NextResponse.json(
      { error: "Please complete all required onboarding questions." },
      { status: 400 }
    );
  }

  const { error } = await auth.supabase.from("user_onboarding").upsert(
    {
      user_id: auth.user.id,
      business_name: payload.businessName,
      industry: payload.industry,
      team_size: payload.teamSize,
      monthly_review_volume: payload.monthlyReviewVolume,
      primary_goal: payload.primaryGoal,
      biggest_challenge: payload.biggestChallenge ?? null,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: "Failed to save onboarding profile" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

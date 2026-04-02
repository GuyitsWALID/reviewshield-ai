import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error || !auth.user) return auth.error!;

  const { data } = await auth.supabase
    .from("gbp_connections")
    .select("id,account_id,location_id,location_name,expires_at")
    .eq("user_id", auth.user.id)
    .order("location_name", { ascending: true });

  return NextResponse.json({ connections: data ?? [] });
}

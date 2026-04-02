import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildGbpOAuthUrl } from "@/lib/gbp-oauth";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirect = new URL("/sign-in", request.url);
    return NextResponse.redirect(redirect);
  }

  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/gbp/callback`;
  const state = crypto.randomUUID();
  const oauthUrl = buildGbpOAuthUrl({ redirectUri, state });

  const response = NextResponse.redirect(oauthUrl);
  response.cookies.set("gbp_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  return response;
}

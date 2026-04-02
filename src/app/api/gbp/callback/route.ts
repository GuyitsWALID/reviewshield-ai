import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  exchangeGoogleCodeForToken,
  fetchGbpAccounts,
  fetchGbpLocations,
  parseAccountId,
  parseLocationId,
} from "@/lib/gbp-oauth";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirect = new URL("/sign-in", request.url);
    return NextResponse.redirect(redirect);
  }

  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  const cookieState = request.cookies.get("gbp_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    const redirect = new URL("/dashboard/settings?gbp=error", request.url);
    return NextResponse.redirect(redirect);
  }

  const redirectUri = `${request.nextUrl.origin}/api/gbp/callback`;

  try {
    const token = await exchangeGoogleCodeForToken({ code, redirectUri });
    const accounts = await fetchGbpAccounts(token.access_token);

    const rows: Array<{
      user_id: string;
      account_id: string;
      location_id: string;
      location_name: string;
      access_token: string;
      refresh_token: string | null;
      expires_at: string;
    }> = [];

    for (const account of accounts) {
      const locations = await fetchGbpLocations({
        accessToken: token.access_token,
        accountName: account.name,
      });

      for (const location of locations) {
        rows.push({
          user_id: user.id,
          account_id: parseAccountId(account.name),
          location_id: parseLocationId(location.name),
          location_name: location.title ?? parseLocationId(location.name),
          access_token: token.access_token,
          refresh_token: token.refresh_token ?? null,
          expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
        });
      }
    }

    await supabase.from("gbp_connections").delete().eq("user_id", user.id);

    if (rows.length > 0) {
      await supabase.from("gbp_connections").insert(rows);
    }

    const redirect = new URL(`/dashboard/settings?gbp=connected&locations=${rows.length}`, request.url);
    const response = NextResponse.redirect(redirect);
    response.cookies.delete("gbp_oauth_state");
    return response;
  } catch {
    const redirect = new URL("/dashboard/settings?gbp=error", request.url);
    return NextResponse.redirect(redirect);
  }
}

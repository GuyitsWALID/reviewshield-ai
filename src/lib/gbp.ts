import { createSupabaseServerClient } from "@/lib/supabase/server";

interface GbpConnection {
  id: string;
  user_id: string;
  account_id: string;
  location_id: string;
  location_name: string | null;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
}

interface GoogleReview {
  reviewId: string;
  reviewer?: {
    displayName?: string;
  };
  starRating?: string;
  comment?: string;
  createTime?: string;
  name?: string;
}

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() - Date.now() < 60_000;
}

async function refreshGoogleToken(refreshToken: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Google access token");
  }

  return response.json() as Promise<{
    access_token: string;
    expires_in: number;
  }>;
}

export async function getUserConnections(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("gbp_connections")
    .select("id,user_id,account_id,location_id,location_name,access_token,refresh_token,expires_at")
    .eq("user_id", userId);

  if (error) {
    return [] as GbpConnection[];
  }

  return (data ?? []) as GbpConnection[];
}

export async function getValidGoogleAccessToken(connection: GbpConnection): Promise<string> {
  if (!isExpired(connection.expires_at)) {
    return connection.access_token;
  }

  if (!connection.refresh_token) {
    return connection.access_token;
  }

  const refreshed = await refreshGoogleToken(connection.refresh_token);
  const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("gbp_connections")
    .update({ access_token: refreshed.access_token, expires_at: expiresAt })
    .eq("id", connection.id);

  return refreshed.access_token;
}

export async function fetchGoogleReviews(connection: GbpConnection): Promise<GoogleReview[]> {
  const accessToken = await getValidGoogleAccessToken(connection);

  const endpoint = `https://mybusiness.googleapis.com/v4/accounts/${connection.account_id}/locations/${connection.location_id}/reviews`;
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as { reviews?: GoogleReview[] };
  return payload.reviews ?? [];
}

export async function replyToGoogleReview(params: {
  connection: GbpConnection;
  googleReviewId: string;
  message: string;
}) {
  const accessToken = await getValidGoogleAccessToken(params.connection);

  const endpoint = `https://mybusiness.googleapis.com/v4/accounts/${params.connection.account_id}/locations/${params.connection.location_id}/reviews/${params.googleReviewId}/reply`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment: params.message }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to send reply to Google");
  }

  return response.json();
}

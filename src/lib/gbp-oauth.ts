import { requireGoogleOAuthEnv } from "@/lib/env";

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
}

interface GoogleAccount {
  name: string;
  accountName?: string;
  type?: string;
}

interface GoogleLocation {
  name: string;
  title?: string;
}

function requireGoogleEnv() {
  return requireGoogleOAuthEnv();
}

export function buildGbpOAuthUrl(params: {
  redirectUri: string;
  state: string;
}) {
  const { clientId } = requireGoogleEnv();
  const scope = "https://www.googleapis.com/auth/business.manage";

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", params.state);

  return url.toString();
}

export async function exchangeGoogleCodeForToken(params: {
  code: string;
  redirectUri: string;
}) {
  const { clientId, clientSecret } = requireGoogleEnv();

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: params.code,
      grant_type: "authorization_code",
      redirect_uri: params.redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error("Google OAuth token exchange failed");
  }

  return (await response.json()) as GoogleTokenResponse;
}

export async function fetchGbpAccounts(accessToken: string) {
  const response = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return [] as GoogleAccount[];
  }

  const payload = (await response.json()) as { accounts?: GoogleAccount[] };
  return payload.accounts ?? [];
}

export async function fetchGbpLocations(params: {
  accessToken: string;
  accountName: string;
}) {
  const encodedAccount = encodeURIComponent(params.accountName);
  const endpoint = `https://mybusinessbusinessinformation.googleapis.com/v1/${encodedAccount}/locations?readMask=name,title`;

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return [] as GoogleLocation[];
  }

  const payload = (await response.json()) as { locations?: GoogleLocation[] };
  return payload.locations ?? [];
}

export function parseAccountId(accountName: string) {
  return accountName.split("/")[1] ?? accountName;
}

export function parseLocationId(locationName: string) {
  return locationName.split("/").at(-1) ?? locationName;
}

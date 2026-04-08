"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/env";

export function createSupabaseBrowserClient() {
  const { url, key } = getSupabasePublicEnv();

  if (!url || !key) {
    return null;
  }

  return createBrowserClient(url, key);
}

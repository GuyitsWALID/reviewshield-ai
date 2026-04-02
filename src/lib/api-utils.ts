import { type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireUser(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, supabase, error: new Response("Unauthorized", { status: 401 }) };
  }

  return { user, supabase, error: null };
}

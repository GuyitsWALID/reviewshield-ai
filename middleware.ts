import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

const DASHBOARD_PREFIX = "/dashboard";
const ONBOARDING_PATH = "/onboarding";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isDashboardRoute = pathname.startsWith(DASHBOARD_PREFIX);
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";
  const isOnboardingRoute = pathname.startsWith(ONBOARDING_PATH);

  if ((isDashboardRoute || isOnboardingRoute) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user) {
    const onboardingRequired = user.user_metadata?.onboarding_required === true;

    let onboarding = null as null | {
      onboarding_completed: boolean;
      setup_completed: boolean;
    };

    if (onboardingRequired) {
      const { data } = await supabase
        .from("user_onboarding")
        .select("onboarding_completed,setup_completed")
        .eq("user_id", user.id)
        .maybeSingle();
      onboarding = data;
    }

    const onboardingCompleted = onboarding?.onboarding_completed === true;
    const setupCompleted = onboarding?.setup_completed === true;
    const mustGoToOnboarding = onboardingRequired && (!onboardingCompleted || !setupCompleted);

    if (isDashboardRoute && mustGoToOnboarding) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = ONBOARDING_PATH;
      redirectUrl.searchParams.set("step", onboardingCompleted ? "setup" : "questions");
      return NextResponse.redirect(redirectUrl);
    }

    if (isAuthRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = mustGoToOnboarding ? ONBOARDING_PATH : "/dashboard";
      if (mustGoToOnboarding) {
        redirectUrl.searchParams.set("step", onboardingCompleted ? "setup" : "questions");
      }
      return NextResponse.redirect(redirectUrl);
    }

    if (isOnboardingRoute && !mustGoToOnboarding) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/onboarding"],
};

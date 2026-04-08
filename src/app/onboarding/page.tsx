"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Shield } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface OnboardingProfile {
  business_name: string | null;
  industry: string | null;
  team_size: string | null;
  monthly_review_volume: string | null;
  primary_goal: string | null;
  biggest_challenge: string | null;
  onboarding_completed: boolean;
  setup_completed: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedLocations, setConnectedLocations] = useState(0);
  const [step, setStep] = useState<"questions" | "setup">(
    searchParams.get("step") === "setup" ? "setup" : "questions"
  );

  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [monthlyReviewVolume, setMonthlyReviewVolume] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [biggestChallenge, setBiggestChallenge] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      if (!supabase) {
        setLoading(false);
        setError("Supabase is not configured.");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in?next=/onboarding");
        return;
      }

      // If user comes from Google signup flow, mark onboarding as required.
      if (searchParams.get("source") === "signup-google") {
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            onboarding_required: true,
            onboarding_completed: false,
            setup_completed: false,
          },
        });
      }

      const response = await fetch("/api/onboarding", { cache: "no-store" });
      if (!response.ok) {
        setLoading(false);
        setError("Failed to load onboarding details.");
        return;
      }

      const payload = (await response.json()) as {
        profile: OnboardingProfile | null;
        connectedLocations: number;
      };

      setConnectedLocations(payload.connectedLocations ?? 0);

      if (payload.profile) {
        setBusinessName(payload.profile.business_name ?? "");
        setIndustry(payload.profile.industry ?? "");
        setTeamSize(payload.profile.team_size ?? "");
        setMonthlyReviewVolume(payload.profile.monthly_review_volume ?? "");
        setPrimaryGoal(payload.profile.primary_goal ?? "");
        setBiggestChallenge(payload.profile.biggest_challenge ?? "");

        if (payload.profile.onboarding_completed && !payload.profile.setup_completed) {
          setStep("setup");
        }

        if (payload.profile.onboarding_completed && payload.profile.setup_completed) {
          await supabase.auth.updateUser({
            data: {
              ...user.user_metadata,
              onboarding_required: false,
              onboarding_completed: true,
              setup_completed: true,
            },
          });
          router.push("/dashboard");
          router.refresh();
          return;
        }
      }

      setLoading(false);
    };

    void load();
  }, [router, searchParams, supabase]);

  const saveOnboarding = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save",
        businessName,
        industry,
        teamSize,
        monthlyReviewVolume,
        primaryGoal,
        biggestChallenge,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setSaving(false);
      setError(payload.error ?? "Failed to save onboarding answers.");
      return;
    }

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            onboarding_required: true,
            onboarding_completed: true,
            setup_completed: false,
          },
        });
      }
    }

    setSaving(false);
    setStep("setup");
  };

  const finishSetup = async () => {
    setFinishing(true);
    setError(null);

    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete_setup" }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setFinishing(false);
      setError(payload.error ?? "Failed to complete setup.");
      return;
    }

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            onboarding_required: false,
            onboarding_completed: true,
            setup_completed: true,
          },
        });
      }
    }

    router.push("/dashboard");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#d2f4ea_0%,#f7fffc_30%,#fff7ef_65%,#ffffff_100%)] px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">Welcome to ReviewShield</p>
            <p className="text-sm text-slate-500">Step {step === "questions" ? "1" : "2"} of 2</p>
          </div>
        </div>

        {step === "questions" ? (
          <Card className="border-slate-200 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Tell us about your business</CardTitle>
              <CardDescription>
                We use this to personalize detection defaults and dashboard insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={saveOnboarding}>
                <div className="grid gap-2">
                  <Label htmlFor="businessName">Business name</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    placeholder="Acme Dental Clinic"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={(value) => setIndustry(value ?? "") }>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant / Food</SelectItem>
                      <SelectItem value="healthcare">Healthcare / Clinic</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="services">Local Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="teamSize">Team size</Label>
                    <Select value={teamSize} onValueChange={(value) => setTeamSize(value ?? "") }>
                      <SelectTrigger id="teamSize">
                        <SelectValue placeholder="Team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Just me</SelectItem>
                        <SelectItem value="2-10">2-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51+">51+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reviewVolume">Monthly reviews</Label>
                    <Select
                      value={monthlyReviewVolume}
                      onValueChange={(value) => setMonthlyReviewVolume(value ?? "") }
                    >
                      <SelectTrigger id="reviewVolume">
                        <SelectValue placeholder="Review volume" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-20">0-20</SelectItem>
                        <SelectItem value="21-100">21-100</SelectItem>
                        <SelectItem value="101-500">101-500</SelectItem>
                        <SelectItem value="500+">500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="goal">Primary goal</Label>
                  <Select value={primaryGoal} onValueChange={(value) => setPrimaryGoal(value ?? "") }>
                    <SelectTrigger id="goal">
                      <SelectValue placeholder="What matters most right now?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="detect-fakes">Detect fake reviews faster</SelectItem>
                      <SelectItem value="protect-rating">Protect overall rating</SelectItem>
                      <SelectItem value="save-time">Save team response time</SelectItem>
                      <SelectItem value="report-evidence">Generate better report evidence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="challenge">Biggest review challenge (optional)</Label>
                  <Textarea
                    id="challenge"
                    value={biggestChallenge}
                    onChange={(event) => setBiggestChallenge(event.target.value)}
                    placeholder="Tell us what you struggle with today"
                    rows={3}
                  />
                </div>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={saving}>
                  {saving ? "Saving..." : "Continue to setup"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-200 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Connect your Google Business Profile</CardTitle>
              <CardDescription>
                Connect at least one location to start scanning and alerting in real time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Connected locations</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{connectedLocations}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => {
                    window.location.href = "/api/gbp/connect?from=onboarding";
                  }}
                >
                  Connect Google Business Profile
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh connection status
                </Button>
              </div>

              {connectedLocations > 0 ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Setup ready
                </Badge>
              ) : (
                <p className="text-sm text-slate-600">
                  No locations connected yet. Complete this to activate dashboard scanning.
                </p>
              )}

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <Button
                className="w-full bg-slate-900 text-white hover:bg-slate-800"
                disabled={connectedLocations === 0 || finishing}
                onClick={finishSetup}
              >
                {finishing ? "Finishing setup..." : "Finish setup and open dashboard"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

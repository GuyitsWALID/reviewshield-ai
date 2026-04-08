"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { GoogleIcon } from "@/components/google-icon";
import { Shield, Sparkles } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabase) {
      setLoading(false);
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const url = new URL(window.location.href);
    const nextPath = url.searchParams.get("next") || "/dashboard";

    router.push(nextPath);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and a public Supabase key.");
      return;
    }

    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/dashboard`,
      },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-6 py-8">
      <div className="pointer-events-none absolute -left-36 top-[-6rem] h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-[-6rem] h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-6 lg:grid-cols-2">
        <div className="hidden rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur lg:block">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">ReviewShield AI</p>
              <p className="text-xs text-slate-500">Reputation defense system</p>
            </div>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Protect every location, every day.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Detect suspicious Google reviews, collect evidence, and respond faster with one focused workflow.
          </p>
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Live fake-review detection enabled
            </p>
            <p className="mt-2 text-xs text-slate-500">Sign in to continue scanning and alerting across your connected GBP locations.</p>
          </div>
        </div>

        <Card className="w-full border-slate-200 bg-white/90 shadow-lg backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in with email and password, or continue with Google.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@business.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <Checkbox /> Remember me
                </label>
                <Link href="#" className="text-indigo-600 hover:text-indigo-700">Forgot password?</Link>
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wide text-slate-400">
                <span className="bg-white px-2">or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2" onClick={handleGoogleSignIn}>
              <GoogleIcon className="h-4 w-4" />
              Continue with Google
            </Button>

            <p className="text-center text-sm text-slate-600">
              Don&apos;t have an account? <Link href="/sign-up" className="font-medium text-slate-900 hover:text-slate-700">Sign Up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

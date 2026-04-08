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
import { CheckCircle2, Shield } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!supabase) {
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and a public Supabase key.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          onboarding_required: true,
          onboarding_completed: false,
          setup_completed: false,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push("/onboarding?step=questions");
    router.refresh();
  };

  const handleGoogleSignUp = async () => {
    if (!supabase) {
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and a public Supabase key.");
      return;
    }

    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/onboarding?source=signup-google&step=questions`,
      },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-6 py-8">
      <div className="pointer-events-none absolute -left-36 top-[-6rem] h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-[-6rem] h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-6 lg:grid-cols-2">
        <Card className="order-2 w-full border-slate-200 bg-white/90 shadow-lg backdrop-blur lg:order-1">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Use email and password, or continue with Google to get started quickly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>
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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
              <label className="flex items-start gap-2 text-sm text-slate-600">
                <Checkbox className="mt-0.5" required />
                I agree to the Terms of Service and Privacy Policy
              </label>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
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

            <Button variant="outline" className="w-full gap-2" onClick={handleGoogleSignUp}>
              <GoogleIcon className="h-4 w-4" />
              Continue with Google
            </Button>

            <p className="text-center text-sm text-slate-600">
              Already have an account? <Link href="/sign-in" className="font-medium text-slate-900 hover:text-slate-700">Sign In</Link>
            </p>
          </CardContent>
        </Card>

        <div className="order-1 rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur lg:order-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">ReviewShield AI</p>
              <p className="text-xs text-slate-500">Reputation defense system</p>
            </div>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Build trust from day one.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Connect your business profile, detect suspicious reviews instantly, and keep your public reputation protected.
          </p>

          <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Google Business Profile connection
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Real-time suspicious review alerts
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Evidence package export for reports
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

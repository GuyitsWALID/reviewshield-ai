import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 p-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md items-center">
        <Card className="w-full border-slate-200 shadow-md">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to continue monitoring your reputation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@business.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <Checkbox /> Remember me
              </label>
              <Link href="#" className="text-indigo-600 hover:text-indigo-700">Forgot password?</Link>
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Sign In</Button>
            <Button variant="outline" className="w-full">Continue with Google</Button>
            <p className="text-center text-sm text-slate-600">
              Don&apos;t have an account? <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-700">Sign Up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

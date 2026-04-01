import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Brain,
  FileText,
  Bell,
  Globe,
  BarChart3,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Radar,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Detection Engine",
    description: "Hybrid AI analyzes reviews using rules + BERT + behavioral patterns.",
  },
  {
    icon: FileText,
    title: "Evidence Package Generator",
    description: "Auto-generate PDF reports with proof for Google removal requests.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Get instant notifications when suspicious reviews appear.",
  },
  {
    icon: Globe,
    title: "Multi-Platform Monitoring",
    description: "Monitor Google, Yelp, and Facebook from one dashboard.",
  },
  {
    icon: BarChart3,
    title: "Transparent Scoring",
    description: "See exactly why each review was flagged with confidence scores.",
  },
  {
    icon: MessageSquare,
    title: "Smart Responses",
    description: "AI-generated response suggestions for every review.",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Perfect for getting started",
    features: ["1 location", "50 scans/month", "Basic rules detection", "Email support"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Starter",
    price: "$19",
    period: "/mo",
    description: "For small businesses",
    features: [
      "3 locations",
      "Unlimited scans",
      "Full AI detection",
      "Real-time alerts",
      "Evidence packages",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "For growing businesses",
    features: ["Unlimited locations", "API access", "Team collaboration", "Custom rules", "24/7 support"],
    cta: "Start Free Trial",
    popular: false,
  },
];

const trustLogos = ["Google", "Yelp", "Facebook", "Trustpilot", "G2"];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#d2f4ea_0%,#f7fffc_30%,#fff7ef_65%,#ffffff_100%)]">
      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">ReviewShield</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">Features</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">Pricing</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">How It Works</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:inline-flex">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pb-24 pt-32">
        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-300/35 blur-3xl" />
        <div className="absolute -left-16 top-48 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge className="mb-6 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
              <Sparkles className="mr-1 h-3 w-3" />
              Detection That Explains Itself
            </Badge>
            <h1 className="mb-6 text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">
              Turn review chaos into an evidence-backed reputation engine
            </h1>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-600">
              ReviewShield scores suspicious reviews in real time, shows the why behind each decision, and prepares removal-ready evidence so your team can act fast without guesswork.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">Watch Demo</Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-600">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" />Setup in under 10 minutes</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" />Works with Google, Yelp, Facebook</div>
            </div>
          </div>

          <Card className="border-slate-200/80 bg-white/85 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Radar className="h-5 w-5 text-emerald-600" />Live Threat Feed</CardTitle>
              <CardDescription>Current risk stream for your locations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { author: "M. Chen", risk: "Critical", score: 92, reason: "Template phrasing + burst activity" },
                { author: "E. Rodriguez", risk: "High", score: 88, reason: "All-caps abuse + account age anomaly" },
                { author: "D. Wilson", risk: "Medium", score: 45, reason: "Mixed sentiment + unnatural cadence" },
              ].map((item) => (
                <div key={item.author} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{item.author}</p>
                    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">{item.risk} {item.score}%</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{item.reason}</p>
                </div>
              ))}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <div className="mb-1 flex items-center gap-2 font-medium"><Zap className="h-4 w-4" />Auto-generated evidence pack ready</div>
                Submit to Google in one click.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-16 max-w-7xl text-center">
          <p className="mb-6 text-sm text-slate-500">Trusted by 500+ businesses</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-65">
            {trustLogos.map((logo) => (
              <span key={logo} className="text-lg font-semibold text-slate-500">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">Designed for teams that need speed and proof</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">A bolder workflow with fewer clicks, clearer signals, and evidence that is easy to submit and audit.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={feature.title} className={`border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${index === 0 ? "md:col-span-2" : ""}`}>
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100"><feature.icon className="h-6 w-6 text-emerald-700" /></div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent><p className="text-slate-600">{feature.description}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">How it works</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">Three steps from noisy reviews to removal requests with confidence.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Connect Platforms", text: "Bring in Google, Yelp, and Facebook streams from all locations in one place." },
              { step: "02", title: "Score and Explain", text: "Every review gets a transparent risk score and a plain-language breakdown." },
              { step: "03", title: "Submit Evidence", text: "Generate export-ready evidence packages and submit takedown requests fast." },
            ].map((item) => (
              <Card key={item.step} className="border-slate-200 bg-white/85">
                <CardHeader>
                  <p className="mb-2 text-sm font-semibold tracking-wide text-emerald-700">{item.step}</p>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent><p className="text-slate-600">{item.text}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#f6fbf8] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">Pricing that scales with your reputation risk</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">Start free, upgrade when the volume increases.</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {pricing.map((plan) => (
              <Card key={plan.name} className={`relative border-2 ${plan.popular ? "border-emerald-500 shadow-lg" : "border-slate-200"}`}>
                {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white">Most Popular</Badge>}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6"><span className="text-4xl font-bold text-slate-900">{plan.price}</span><span className="text-slate-500">{plan.period}</span></div>
                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{feature}</li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}`}>{plan.cta}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-100 via-white to-orange-100 p-10 text-center shadow-sm">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">Protect your public reputation before the next fake wave hits</h2>
          <p className="mb-8 text-lg text-slate-600">Start your trial today and get your first threat report in minutes.</p>
          <Button size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">Start Free Trial<ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </section>

      <footer className="bg-slate-900 px-6 py-16 text-slate-300">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600"><Shield className="h-5 w-5 text-white" /></div>
                <span className="text-xl font-bold text-white">ReviewShield</span>
              </div>
              <p className="text-sm">AI-powered fake review detection for modern businesses.</p>
            </div>
            <div><h3 className="mb-4 font-semibold text-white">Product</h3><ul className="space-y-2 text-sm"><li>Features</li><li>Pricing</li><li>Integrations</li></ul></div>
            <div><h3 className="mb-4 font-semibold text-white">Resources</h3><ul className="space-y-2 text-sm"><li>Documentation</li><li>API</li><li>Support</li></ul></div>
            <div><h3 className="mb-4 font-semibold text-white">Company</h3><ul className="space-y-2 text-sm"><li>About</li><li>Privacy</li><li>Terms</li></ul></div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm"><p>© 2026 ReviewShield. All rights reserved.</p></div>
        </div>
      </footer>
    </div>
  );
}

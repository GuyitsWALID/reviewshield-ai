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
  Star,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Detection Engine",
    description: "Hybrid AI analyzes reviews using rules + BERT + behavioral patterns",
  },
  {
    icon: FileText,
    title: "Evidence Package Generator",
    description: "Auto-generate PDF reports with proof for Google removal requests",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Get instant notifications when suspicious reviews appear",
  },
  {
    icon: Globe,
    title: "Multi-Platform Monitoring",
    description: "Monitor Google, Yelp, and Facebook from one dashboard",
  },
  {
    icon: BarChart3,
    title: "Transparent Scoring",
    description: "See exactly why each review was flagged with confidence scores",
  },
  {
    icon: MessageSquare,
    title: "Smart Responses",
    description: "AI-generated reply suggestions for every review",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Perfect for getting started",
    features: [
      "1 location",
      "50 scans/month",
      "Basic rules detection",
      "Email support",
    ],
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
      "Priority email support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "For growing businesses",
    features: [
      "Unlimited locations",
      "GNN detection",
      "API access",
      "Team collaboration",
      "Custom rules",
      "24/7 phone support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
];

const trustLogos = [
  "Google", "Yelp", "Facebook", "Trustpilot", "G2"
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ReviewShield</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 transition-all hover:scale-[1.02]">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-orange-50/30" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-50 text-blue-700 hover:bg-blue-50 border-0">
              <Star className="w-3 h-3 mr-1" />
              AI-Powered Fake Review Detection
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Protect Your Business From Fake Reviews
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Detect, analyze, and remove fake reviews before they hurt your reputation.
              The only AI-powered platform built for SMBs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 transition-all hover:scale-[1.02]">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-border">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-6">Trusted by 500+ businesses</p>
            <div className="flex items-center justify-center gap-8 opacity-50">
              {trustLogos.map((logo) => (
                <span key={logo} className="text-lg font-semibold text-muted-foreground">{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Fight Fake Reviews
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to detect, analyze, and remove fake reviews from your business listings.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Connect Your Business</h3>
              <p className="text-muted-foreground">
                Link your Google Business Profile and other platforms to start monitoring reviews.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">AI Analyzes Reviews</h3>
              <p className="text-muted-foreground">
                Our hybrid AI engine scans each review for fake patterns and assigns a risk score.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Remove With Evidence</h3>
              <p className="text-muted-foreground">
                Generate evidence packages and submit removal requests directly to Google.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and scale as your business grows. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <Card key={plan.name} className={`border-2 ${plan.popular ? 'border-primary shadow-lg' : 'border-border'} relative`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-orange-500 hover:bg-orange-600' : ''}`}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Protect Your Business?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join hundreds of businesses already using ReviewShield to detect and remove fake reviews.
          </p>
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 transition-all hover:scale-[1.02]">
            Start Free Trial
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-white">ReviewShield</span>
              </div>
              <p className="text-sm">
                AI-powered fake review detection for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            <p>&copy; 2026 ReviewShield AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Clock3, ExternalLink, RefreshCw, Search, ShieldCheck, Star } from "lucide-react";
import type { DashboardSummary, Review } from "@/lib/types";

const emptySummary: DashboardSummary = {
  totalReviews: 0,
  fakeDetected: 0,
  removedSuccessfully: 0,
  healthScore: 0,
  recentReviews: [],
};

function getRiskBadgeStyle(score: number) {
  if (score >= 85) return "bg-red-100 text-red-700";
  if (score >= 65) return "bg-orange-100 text-orange-700";
  if (score >= 35) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/dashboard/summary", { cache: "no-store" });
    if (response.ok) {
      const data = (await response.json()) as DashboardSummary;
      setSummary(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const syncReviews = async () => {
    setSyncing(true);
    await fetch("/api/reviews?sync=true", { cache: "no-store" });
    await loadSummary();
    setSyncing(false);
  };

  const stats = [
    { title: "Total Reviews", value: summary.totalReviews, icon: Star },
    { title: "Fake Detected", value: summary.fakeDetected, icon: AlertTriangle },
    { title: "Successfully Removed", value: summary.removedSuccessfully, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-100 via-white to-orange-100 p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold tracking-wide text-emerald-700">TODAY'S SNAPSHOT</p>
            <h2 className="text-2xl font-bold text-slate-900">Your reputation shield is active</h2>
            <p className="text-sm text-slate-600">
              {summary.totalReviews} reviews tracked, {summary.fakeDetected} high-risk items detected.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2 bg-white" onClick={loadSummary}>
              <Clock3 className="h-4 w-4" />
              Refresh Snapshot
            </Button>
            <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700" onClick={syncReviews} disabled={syncing}>
              <ShieldCheck className="h-4 w-4" />
              {syncing ? "Syncing GBP..." : "Sync Google Reviews"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Monitor and manage your business reviews</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={syncReviews} disabled={syncing}>
            <Search className="w-4 h-4" />
            Scan Reviews
          </Button>
          <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700" onClick={loadSummary} disabled={loading}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <span className="text-2xl font-bold text-slate-900">{loading ? "..." : stat.value}</span>
                </div>
                <div className="rounded-lg bg-slate-100 p-3">
                  <stat.icon className="h-5 w-5 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-slate-500">Health Score</p>
            <div className="mt-1 flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">{summary.healthScore}/100</span>
            </div>
            <div className="mt-3">
              <Progress value={summary.healthScore} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Latest reviews with risk analysis</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            <Link href="/dashboard/reviews" className="inline-flex items-center gap-1">
              View All
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {summary.recentReviews.length === 0 ? (
            <p className="text-sm text-slate-500">No reviews yet. Connect Supabase and run Sync Google Reviews.</p>
          ) : (
            <div className="space-y-4">
              {summary.recentReviews.map((review: Review) => (
                <div key={review.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{review.author}</p>
                      <p className="text-xs text-slate-500">{review.date} · {review.location}</p>
                    </div>
                    <Badge className={getRiskBadgeStyle(review.riskScore)}>{review.riskScore}%</Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-slate-700">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

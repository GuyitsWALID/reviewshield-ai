"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Download, Eye, Flag, Globe, MessageSquare, RefreshCw, Search } from "lucide-react";
import type { Review } from "@/lib/types";

const riskStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const statusStyles: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700",
  flagged: "bg-amber-100 text-amber-700",
  reported: "bg-indigo-100 text-indigo-700",
  legitimate: "bg-emerald-100 text-emerald-700",
};

function confidenceMeaning(score: number) {
  if (score >= 90) return "Critical confidence: very likely fake.";
  if (score >= 70) return "High confidence: likely fake, review evidence.";
  if (score >= 40) return "Medium confidence: ambiguous, verify manually.";
  return "Low confidence: likely legitimate.";
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [riskLevel, setRiskLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadReviews = useCallback(async (sync = false) => {
    setLoading(true);
    const response = await fetch(`/api/reviews${sync ? "?sync=true" : ""}`, { cache: "no-store" });
    if (response.ok) {
      const data = (await response.json()) as { reviews: Review[] };
      setReviews(data.reviews ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (platform !== "all" && review.platform !== platform) return false;
      if (riskLevel !== "all" && review.riskLevel !== riskLevel) return false;
      if (status !== "all" && review.status !== status) return false;
      if (query.trim()) {
        const term = query.toLowerCase();
        return (
          review.author.toLowerCase().includes(term) ||
          review.content.toLowerCase().includes(term) ||
          review.location.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [platform, query, reviews, riskLevel, status]);

  const handleReply = async (reviewId: string) => {
    const message = window.prompt("Enter your owner reply:");
    if (!message) return;

    const response = await fetch(`/api/reviews/${reviewId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      setActionMessage("Reply sent to Google successfully.");
      await loadReviews();
      return;
    }

    const error = (await response.json().catch(() => ({}))) as { error?: string };
    setActionMessage(error.error ?? "Failed to send reply.");
  };

  const handleReport = async (reviewId: string) => {
    const response = await fetch(`/api/reviews/${reviewId}/report`, { method: "POST" });
    const payload = (await response.json()) as { googleReportUrl?: string; error?: string };

    if (!response.ok) {
      setActionMessage(payload.error ?? "Failed to generate report package.");
      return;
    }

    setActionMessage("Evidence package generated. Opening Google help form.");
    if (payload.googleReportUrl) {
      window.open(payload.googleReportUrl, "_blank", "noopener,noreferrer");
    }

    await loadReviews();
  };

  const handleEvidenceExport = (reviewId: string) => {
    window.open(`/api/evidence/${reviewId}`, "_blank", "noopener,noreferrer");
  };

  const handleKnownCustomer = async (reviewId: string, isKnownCustomer: boolean) => {
    const response = await fetch(`/api/reviews/${reviewId}/customer-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isKnownCustomer }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setActionMessage(payload.error ?? "Failed to update customer verification.");
      return;
    }

    setActionMessage(
      isKnownCustomer
        ? "Marked as known customer. This will be included in evidence."
        : "Marked as unknown customer."
    );
    await loadReviews();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
          <p className="text-slate-500">Monitor and manage all your business reviews</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => loadReviews(true)}>
            <RefreshCw className="h-4 w-4" />
            Sync GBP
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => loadReviews(false)}>
            <Download className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {actionMessage ? <p className="text-sm text-indigo-700">{actionMessage}</p> : null}

      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search reviews..." className="pl-10" value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <Select value={platform} onValueChange={(value) => setPlatform(value ?? "all")}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Platform" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Yelp">Yelp</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskLevel} onValueChange={(value) => setRiskLevel(value ?? "all")}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Risk" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(value) => setStatus(value ?? "all")}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="legitimate">Legitimate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>All Reviews ({filteredReviews.length})</CardTitle>
          <CardDescription>{loading ? "Loading reviews..." : "Live data from Supabase and Google Business Profile"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{review.author}</p>
                    <p className="text-sm text-slate-500">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={riskStyles[review.riskLevel] || riskStyles.low}>{review.riskLevel.toUpperCase()} {review.riskScore}%</Badge>
                    <Badge className={statusStyles[review.status] || statusStyles.pending}>{review.status}</Badge>
                    {review.isKnownCustomer === true ? (
                      <Badge className="bg-emerald-100 text-emerald-700">Known Customer</Badge>
                    ) : null}
                    {review.isKnownCustomer === false ? (
                      <Badge className="bg-slate-100 text-slate-700">Unverified Customer</Badge>
                    ) : null}
                  </div>
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Globe className="mr-1 h-3 w-3" />
                    {review.platform}
                  </Badge>
                  <span className="text-xs text-slate-500">{review.location}</span>
                </div>

                <p className="mb-3 text-sm text-slate-700">{review.content}</p>

                <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{review.detection}</span>
                </div>

                <p className="mb-3 text-xs text-slate-500">{confidenceMeaning(review.riskScore)}</p>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => handleEvidenceExport(review.id)}>
                    <Eye className="h-3 w-3" />
                    Export Evidence
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => handleReply(review.id)}>
                    <MessageSquare className="h-3 w-3" />
                    Reply
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => handleReport(review.id)}>
                    <Flag className="h-3 w-3" />
                    Report to Google
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleKnownCustomer(review.id, true)}
                  >
                    Mark Known Customer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleKnownCustomer(review.id, false)}
                  >
                    Mark Unknown
                  </Button>
                </div>
              </div>
            ))}

            {!loading && filteredReviews.length === 0 ? (
              <p className="text-sm text-slate-500">No reviews found. Try Sync GBP after connecting locations.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

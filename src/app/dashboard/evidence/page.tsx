"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Copy, Download, ExternalLink, FileText, GitCompare, User, Clock } from "lucide-react";
import type { Review } from "@/lib/types";

const evidenceComponents = [
  { id: "ai-score", label: "AI Confidence Score", icon: Brain },
  { id: "stylometry", label: "Stylometric Analysis", icon: FileText },
  { id: "profile", label: "Reviewer Profile Data", icon: User },
  { id: "temporal", label: "Temporal Analysis", icon: Clock },
  { id: "similarity", label: "Similarity Report", icon: GitCompare },
];

export default function EvidencePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<string[]>(
    evidenceComponents.map((component) => component.id)
  );
  const [review, setReview] = useState<Review | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadReview = useCallback(async () => {
    const response = await fetch("/api/reviews", { cache: "no-store" });
    if (!response.ok) return;

    const data = (await response.json()) as { reviews: Review[] };
    const source = data.reviews ?? [];

    if (selectedId) {
      setReview(source.find((item) => item.id === selectedId) ?? source[0] ?? null);
      return;
    }

    setReview(source[0] ?? null);
  }, [selectedId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      setSelectedId(url.searchParams.get("reviewId"));
    }
  }, []);

  useEffect(() => {
    void loadReview();
  }, [loadReview]);

  const toggleComponent = (id: string) => {
    setSelectedComponents((prev) =>
      prev.includes(id) ? prev.filter((componentId) => componentId !== id) : [...prev, id]
    );
  };

  const riskBadge = useMemo(() => {
    if (!review) return "bg-slate-100 text-slate-700";
    if (review.riskScore >= 85) return "bg-red-100 text-red-700";
    if (review.riskScore >= 65) return "bg-orange-100 text-orange-700";
    if (review.riskScore >= 35) return "bg-amber-100 text-amber-700";
    return "bg-emerald-100 text-emerald-700";
  }, [review]);

  const generateReport = async () => {
    if (!review) return;
    const response = await fetch(`/api/reviews/${review.id}/report`, { method: "POST" });
    const payload = (await response.json()) as { googleReportUrl?: string; error?: string };

    if (!response.ok) {
      setMessage(payload.error ?? "Failed to generate report.");
      return;
    }

    setMessage("Evidence package generated. Redirecting to Google form.");
    if (payload.googleReportUrl) {
      window.open(payload.googleReportUrl, "_blank", "noopener,noreferrer");
    }
  };

  const downloadPdf = () => {
    if (!review) return;
    window.open(`/api/evidence/${review.id}`, "_blank", "noopener,noreferrer");
  };

  const copySummary = async () => {
    if (!review) return;

    const text = [
      `Review ID: ${review.id}`,
      `Author: ${review.author}`,
      `Risk Score: ${review.riskScore}%`,
      `Risk Level: ${review.riskLevel}`,
      `Detection: ${review.detection}`,
      `Content: ${review.content}`,
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setMessage("Evidence summary copied to clipboard.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Evidence Package</h1>
        <p className="text-slate-500">Generate evidence for Google removal requests</p>
      </div>

      {message ? <p className="text-sm text-indigo-700">{message}</p> : null}

      {!review ? (
        <Card className="border-slate-200">
          <CardContent className="py-10 text-sm text-slate-500">No review selected yet. Open Reviews and choose an item first.</CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Selected Review</CardTitle>
                <CardDescription>The review to generate evidence for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{review.author}</p>
                      <p className="text-sm text-slate-500">{review.date}</p>
                    </div>
                    <Badge className={riskBadge}>{review.riskScore}%</Badge>
                  </div>
                  <p className="text-sm text-slate-700">{review.content}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.isKnownCustomer === true ? (
                      <Badge className="bg-emerald-100 text-emerald-700">Known Customer</Badge>
                    ) : null}
                    {review.isKnownCustomer === false ? (
                      <Badge className="bg-slate-100 text-slate-700">Unverified Customer</Badge>
                    ) : null}
                    {review.isKnownCustomer === undefined ? (
                      <Badge className="bg-amber-100 text-amber-700">Customer Not Tagged</Badge>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Detection Summary</CardTitle>
                <CardDescription>Why this review was flagged</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                  <span className="font-medium text-slate-900">Risk Score</span>
                  <span className="text-2xl font-bold text-red-600">{review.riskScore}%</span>
                </div>
                <p className="text-sm text-slate-600">{review.detection}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Evidence Components</CardTitle>
              <CardDescription>Select which evidence to include in the report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {evidenceComponents.map((component) => (
                  <div
                    key={component.id}
                    className={`cursor-pointer rounded-lg border p-4 ${
                      selectedComponents.includes(component.id)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => toggleComponent(component.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox checked={selectedComponents.includes(component.id)} className="mt-1" />
                      <div>
                        <div className="flex items-center gap-2">
                          <component.icon className="h-4 w-4 text-indigo-600" />
                          <Label className="cursor-pointer font-medium">{component.label}</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Add context to your removal request (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Add context for this case..." className="min-h-[100px]" />
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={downloadPdf}>
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="gap-2" onClick={copySummary}>
              <Copy className="h-4 w-4" />
              Copy Summary
            </Button>
            <Button variant="outline" className="gap-2" onClick={generateReport}>
              <ExternalLink className="h-4 w-4" />
              Report to Google
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

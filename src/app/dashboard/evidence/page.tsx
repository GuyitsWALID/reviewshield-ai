"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Download,
  Copy,
  ExternalLink,
  Brain,
  User,
  Clock,
  GitCompare,
} from "lucide-react";

const mockReview = {
  id: "1",
  author: "Michael Chen",
  rating: 1,
  content: "Terrible service! Complete waste of time. Never coming back. This business should be shut down immediately!!!",
  date: "2 hours ago",
  platform: "Google",
};

const evidenceComponents = [
  {
    id: "ai-score",
    label: "AI Confidence Score",
    description: "Overall fake probability score from our ML model",
    icon: Brain,
    selected: true,
  },
  {
    id: "stylometry",
    label: "Stylometric Analysis",
    description: "Language patterns, word choice, and sentence structure analysis",
    icon: FileText,
    selected: true,
  },
  {
    id: "profile",
    label: "Reviewer Profile Data",
    description: "Account age, review history, and behavioral patterns",
    icon: User,
    selected: true,
  },
  {
    id: "temporal",
    label: "Temporal Analysis",
    description: "Review timing patterns and burst detection",
    icon: Clock,
    selected: true,
  },
  {
    id: "similarity",
    label: "Similarity Report",
    description: "Comparison to known fake review patterns",
    icon: GitCompare,
    selected: true,
  },
];

export default function EvidencePage() {
  const [selectedComponents, setSelectedComponents] = useState(
    evidenceComponents.filter((c) => c.selected).map((c) => c.id)
  );

  const toggleComponent = (id: string) => {
    setSelectedComponents((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Evidence Package</h1>
          <p className="text-slate-500">Generate evidence for Google removal requests</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Selected Review Summary */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Selected Review</CardTitle>
            <CardDescription>The review to generate evidence for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-sm font-medium text-slate-600">
                    MC
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{mockReview.author}</p>
                    <p className="text-sm text-slate-500">{mockReview.date}</p>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-700">
                  {mockReview.rating} star
                </Badge>
              </div>
              <p className="text-sm text-slate-700">{mockReview.content}</p>
              <div className="mt-3">
                <Badge variant="outline">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {mockReview.platform}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detection Summary */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Detection Summary</CardTitle>
            <CardDescription>Why this review was flagged</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-slate-900">Risk Score</span>
                <span className="text-2xl font-bold text-red-600">92%</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-2">
                  Contributing Factors
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    Template language detected
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    Excessive punctuation (!!!)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    New account (created today)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    First review from this account
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence Components */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Evidence Components</CardTitle>
          <CardDescription>
            Select which evidence to include in the report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evidenceComponents.map((component) => (
              <div
                key={component.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedComponents.includes(component.id)
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => toggleComponent(component.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedComponents.includes(component.id)}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <component.icon className="w-4 h-4 text-indigo-600" />
                      <Label className="font-medium cursor-pointer">
                        {component.label}
                      </Label>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {component.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>
            Add context to your removal request (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add any additional context that will help support your removal request..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button variant="outline" className="gap-2">
          <Copy className="w-4 h-4" />
          Copy to Clipboard
        </Button>
        <Button variant="outline" className="gap-2">
          <ExternalLink className="w-4 h-4" />
          Open Google Report Form
        </Button>
      </div>
    </div>
  );
}
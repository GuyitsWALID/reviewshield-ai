"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Star,
  Search,
  Filter,
  Download,
  AlertTriangle,
  MessageSquare,
  Flag,
  Eye,
  MoreHorizontal,
  ExternalLink,
  Globe,
} from "lucide-react";

// Mock data
const allReviews = [
  {
    id: "1",
    author: "Michael Chen",
    avatar: "MC",
    rating: 1,
    content: "Terrible service! Complete waste of time. Never coming back. This business should be shut down immediately!!!",
    date: "2 hours ago",
    platform: "Google",
    location: "Main Street",
    riskScore: 92,
    riskLevel: "critical",
    status: "pending",
    detection: "Template language detected, excessive punctuation, new account",
  },
  {
    id: "2",
    author: "Sarah Johnson",
    avatar: "SJ",
    rating: 5,
    content: "Great experience! Staff was friendly and professional. Would highly recommend to anyone looking for quality service.",
    date: "5 hours ago",
    platform: "Google",
    location: "Main Street",
    riskScore: 8,
    riskLevel: "low",
    status: "legitimate",
    detection: "Verified reviewer, consistent sentiment",
  },
  {
    id: "3",
    author: "David Wilson",
    avatar: "DW",
    rating: 2,
    content: "Mediocre at best. Waited 30 minutes for a table that wasn't clean. Food was cold. Not worth the price.",
    date: "1 day ago",
    platform: "Yelp",
    location: "Downtown",
    riskScore: 45,
    riskLevel: "medium",
    status: "flagged",
    detection: "Mixed sentiment, some generic language",
  },
  {
    id: "4",
    author: "Emily Rodriguez",
    avatar: "ER",
    rating: 1,
    content: "WORST EXPERIENCE EVER! ⭐⭐⭐⭐⭐ (if I could add more). Scam alert! They steal your money!",
    date: "2 days ago",
    platform: "Google",
    location: "Main Street",
    riskScore: 88,
    riskLevel: "high",
    status: "pending",
    detection: "All caps usage, emoji spam, extreme language",
  },
  {
    id: "5",
    author: "James Thompson",
    avatar: "JT",
    rating: 4,
    content: "Good value for money. The quality has improved significantly over the past year. Will return.",
    date: "3 days ago",
    platform: "Google",
    location: "Main Street",
    riskScore: 15,
    riskLevel: "low",
    status: "legitimate",
    detection: "Verified account, balanced review",
  },
  {
    id: "6",
    author: "Lisa Anderson",
    avatar: "LA",
    rating: 1,
    content: "STAY AWAY! This is a scam! They took my money and never provided the service. BEWARE!!!",
    date: "4 days ago",
    platform: "Facebook",
    location: "Main Street",
    riskScore: 95,
    riskLevel: "critical",
    status: "reported",
    detection: "Multiple scam keywords, new account, all caps",
  },
  {
    id: "7",
    author: "Robert Martinez",
    avatar: "RM",
    rating: 3,
    content: "Average experience. Nothing special but nothing terrible either. Could be better for the price.",
    date: "5 days ago",
    platform: "Google",
    location: "Downtown",
    riskScore: 25,
    riskLevel: "low",
    status: "legitimate",
    detection: "Neutral review, no red flags",
  },
];

const getRiskBadge = (level: string) => {
  switch (level) {
    case "critical":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    case "high":
      return "bg-orange-100 text-orange-700 hover:bg-orange-100";
    case "medium":
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";
    case "low":
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
    default:
      return "bg-slate-100 text-slate-700 hover:bg-slate-100";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-slate-100 text-slate-700";
    case "flagged":
      return "bg-amber-100 text-amber-700";
    case "reported":
      return "bg-indigo-100 text-indigo-700";
    case "legitimate":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function ReviewsPage() {
  const [platform, setPlatform] = useState("all");
  const [riskLevel, setRiskLevel] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredReviews = allReviews.filter((review) => {
    if (platform !== "all" && review.platform !== platform) return false;
    if (riskLevel !== "all" && review.riskLevel !== riskLevel) return false;
    if (status !== "all" && review.status !== status) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
          <p className="text-slate-500">Monitor and manage all your business reviews</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search reviews..." className="pl-10" />
            </div>
            <Select
              value={platform}
              onValueChange={(value) => setPlatform(value ?? "all")}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Yelp">Yelp</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={riskLevel}
              onValueChange={(value) => setRiskLevel(value ?? "all")}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value ?? "all")}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
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

      {/* Reviews List */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>All Reviews ({filteredReviews.length})</CardTitle>
          <CardDescription>Showing {filteredReviews.length} reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{review.author}</p>
                      <p className="text-sm text-slate-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskBadge(review.riskLevel)}>
                      {review.riskLevel.toUpperCase()} {review.riskScore}%
                    </Badge>
                    <Badge className={getStatusBadge(review.status)}>
                      {review.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    {review.platform}
                  </Badge>
                  <span className="text-xs text-slate-500">• {review.location}</span>
                </div>

                <p className="text-sm text-slate-700 mb-3">{review.content}</p>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{review.detection}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="w-3 h-3" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Reply
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Flag className="w-3 h-3" />
                    Flag
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-all outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50">
                      <MoreHorizontal className="w-3 h-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Generate Evidence</DropdownMenuItem>
                      <DropdownMenuItem>Report to Google</DropdownMenuItem>
                      <DropdownMenuItem>Hide Review</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
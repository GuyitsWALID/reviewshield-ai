import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  Star,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Search,
  RefreshCw,
  FileText,
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  Clock3,
} from "lucide-react";

// Mock data
const stats = [
  {
    title: "Total Reviews",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Star,
  },
  {
    title: "Fake Detected",
    value: "23",
    change: "-5%",
    trend: "down",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    title: "Successfully Removed",
    value: "18",
    change: "+78%",
    trend: "up",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    title: "Health Score",
    value: "85/100",
    change: "+5",
    trend: "up",
    icon: LayoutDashboard,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    progress: 85,
  },
];

const recentReviews = [
  {
    id: "1",
    author: "Michael Chen",
    avatar: "MC",
    rating: 1,
    content: "Terrible service! Complete waste of time. Never coming back. This business should be shut down immediately!!!",
    date: "2 hours ago",
    platform: "Google",
    riskScore: 92,
    riskLevel: "critical",
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
    riskScore: 8,
    riskLevel: "low",
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
    riskScore: 45,
    riskLevel: "medium",
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
    riskScore: 88,
    riskLevel: "high",
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
    riskScore: 15,
    riskLevel: "low",
    detection: "Verified account, balanced review",
  },
];

const getRiskColor = (level: string) => {
  switch (level) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-amber-500";
    case "low":
      return "bg-emerald-500";
    default:
      return "bg-slate-500";
  }
};

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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-100 via-white to-orange-100 p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold tracking-wide text-emerald-700">TODAY'S SNAPSHOT</p>
            <h2 className="text-2xl font-bold text-slate-900">Your reputation shield is active</h2>
            <p className="text-sm text-slate-600">12 new reviews analyzed, 4 flagged for action, 1 evidence package ready.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2 bg-white">
              <Clock3 className="h-4 w-4" />
              Last sync 2m ago
            </Button>
            <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              Review Threat Queue
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
          <Button variant="outline" className="gap-2">
            <Search className="w-4 h-4" />
            Scan Reviews
          </Button>
          <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                    <span
                      className={`text-sm font-medium flex items-center gap-1 ${
                        stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor || "bg-slate-100"}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color || "text-slate-600"}`} />
                </div>
              </div>
              {stat.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Health Score</span>
                    <span>{stat.progress}%</span>
                  </div>
                  <Progress value={stat.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Run Full Scan</p>
              <p className="mt-1 text-sm font-medium text-slate-800">Across all connected platforms</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              Scan Now
            </Button>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Review Queue</p>
              <p className="mt-1 text-sm font-medium text-slate-800">4 items need decision</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Star className="w-4 h-4" />
              Open Queue
            </Button>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-slate-500">Evidence Packs</p>
              <p className="mt-1 text-sm font-medium text-slate-800">1 package ready to submit</p>
            </div>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Generate
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest reviews with risk analysis</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ExternalLink className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-600">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{review.author}</p>
                        <p className="text-sm text-slate-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRiskBadge(review.riskLevel)}>
                        <span className={`mr-2 h-2 w-2 rounded-full ${getRiskColor(review.riskLevel)}`} />
                        {review.riskLevel.toUpperCase()} ({review.riskScore}%)
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-2 flex items-center gap-2">
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
                      {review.platform}
                    </Badge>
                  </div>

                  <p className="mb-3 line-clamp-2 text-sm text-slate-700">{review.content}</p>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Detection: {review.detection}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Current queue composition</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Critical", value: 6, color: "bg-red-500" },
              { label: "High", value: 9, color: "bg-orange-500" },
              { label: "Medium", value: 14, color: "bg-amber-500" },
              { label: "Low", value: 33, color: "bg-emerald-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-medium text-slate-900">Recommendation</p>
              <p className="text-sm text-slate-600">
                Focus on critical and high-risk items from Google first. These reviews have the strongest removal evidence and highest impact on score.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
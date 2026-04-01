"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Bell,
  Mail,
  X,
  ExternalLink,
} from "lucide-react";

const alerts = [
  {
    id: "1",
    type: "suspicious",
    title: "New suspicious review detected",
    description: "A 1-star review on your Main Street location shows signs of being fake. Template language and excessive punctuation detected.",
    time: "2 hours ago",
    severity: "critical",
    reviewId: "1",
    read: false,
  },
  {
    id: "2",
    type: "spike",
    title: "Review spike detected",
    description: "Unusual activity: 12 new reviews received in the last 24 hours. 8 of them are negative.",
    time: "Yesterday",
    severity: "high",
    read: false,
  },
  {
    id: "3",
    type: "removed",
    title: "Successfully removed",
    description: "Google has removed the fake review you reported on Feb 28. The evidence package helped!",
    time: "3 days ago",
    severity: "success",
    reviewId: "4",
    read: false,
  },
  {
    id: "4",
    type: "decision",
    title: "Google decision",
    description: "Your removal request for a suspicious review was denied. Reason: \"Does not violate policy\". You can appeal.",
    time: "5 days ago",
    severity: "info",
    read: true,
  },
  {
    id: "5",
    type: "digest",
    title: "Weekly digest",
    description: "This week: 45 new reviews, 3 suspicious reviews detected, 2 successfully removed. Your health score is 85/100.",
    time: "1 week ago",
    severity: "info",
    read: true,
  },
];

const getAlertIcon = (type: string) => {
  switch (type) {
    case "suspicious":
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    case "spike":
      return <TrendingUp className="w-5 h-5 text-orange-600" />;
    case "removed":
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    case "decision":
      return <Bell className="w-5 h-5 text-sky-600" />;
    case "digest":
      return <Mail className="w-5 h-5 text-purple-600" />;
    default:
      return <Bell className="w-5 h-5 text-slate-600" />;
  }
};

const getSeverityStyle = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-50 border-red-200";
    case "high":
      return "bg-orange-50 border-orange-200";
    case "success":
      return "bg-emerald-50 border-emerald-200";
    case "info":
      return "bg-sky-50 border-sky-200";
    default:
      return "bg-slate-50 border-slate-200";
  }
};

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-700";
    case "high":
      return "bg-orange-100 text-orange-700";
    case "success":
      return "bg-emerald-100 text-emerald-700";
    case "info":
      return "bg-sky-100 text-sky-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function AlertsPage() {
  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
          <p className="text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread alerts` : "All caught up!"}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          Mark all as read
        </Button>
      </div>

      {/* Alerts List */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>All Alerts</CardTitle>
          <CardDescription>
            Stay informed about your review activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getSeverityStyle(alert.severity)} ${
                  !alert.read ? "ring-2 ring-indigo-500/20" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-white">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-slate-900 flex items-center gap-2">
                          {alert.title}
                          {!alert.read && (
                            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                          )}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                      </div>
                      <Badge className={getSeverityBadge(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-slate-500">{alert.time}</span>
                      {alert.reviewId && (
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
                          View Review
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <X className="w-3 h-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
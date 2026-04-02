"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bell, CheckCircle2, ExternalLink, Mail, TrendingUp } from "lucide-react";
import type { AlertItem } from "@/lib/types";

function getAlertIcon(type: string) {
  switch (type) {
    case "suspicious":
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    case "spike":
      return <TrendingUp className="h-5 w-5 text-orange-600" />;
    case "removed":
      return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    case "digest":
      return <Mail className="h-5 w-5 text-indigo-600" />;
    default:
      return <Bell className="h-5 w-5 text-sky-600" />;
  }
}

const severityStyles: Record<string, string> = {
  critical: "bg-red-50 border-red-200",
  high: "bg-orange-50 border-orange-200",
  success: "bg-emerald-50 border-emerald-200",
  info: "bg-sky-50 border-sky-200",
};

const badgeStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  success: "bg-emerald-100 text-emerald-700",
  info: "bg-sky-100 text-sky-700",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/alerts", { cache: "no-store" });
    if (response.ok) {
      const data = (await response.json()) as { alerts: AlertItem[] };
      setAlerts(data.alerts ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadAlerts();
  }, [loadAlerts]);

  const unreadCount = alerts.filter((alert) => !alert.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
          <p className="text-slate-500">{unreadCount} unread alerts</p>
        </div>
        <Button variant="outline" onClick={loadAlerts}>Refresh</Button>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>All Alerts</CardTitle>
          <CardDescription>{loading ? "Loading..." : "Live risk and event feed"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-4 ${severityStyles[alert.severity] || severityStyles.info} ${
                  !alert.read ? "ring-2 ring-indigo-500/20" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-white p-2">{getAlertIcon(alert.type)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="flex items-center gap-2 font-medium text-slate-900">
                          {alert.title}
                          {!alert.read ? <span className="h-2 w-2 rounded-full bg-indigo-500" /> : null}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">{alert.description}</p>
                      </div>
                      <Badge className={badgeStyles[alert.severity] || badgeStyles.info}>{alert.severity}</Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                      <span>{alert.time}</span>
                      {alert.reviewId ? (
                        <a href={`/dashboard/reviews`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                          View Review
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {!loading && alerts.length === 0 ? (
              <p className="text-sm text-slate-500">No alerts available yet.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

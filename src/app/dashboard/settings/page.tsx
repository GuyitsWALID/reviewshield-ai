"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  const [threshold, setThreshold] = useState([70]);
  const [connections, setConnections] = useState<
    Array<{
      id: string;
      account_id: string;
      location_id: string;
      location_name: string | null;
      expires_at: string | null;
    }>
  >([]);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [gbpStatus, setGbpStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const status = url.searchParams.get("gbp");
      if (status) setGbpStatus(status);
    }
  }, []);

  useEffect(() => {
    const loadConnections = async () => {
      setLoadingConnections(true);
      const response = await fetch("/api/gbp/connections", { cache: "no-store" });
      if (response.ok) {
        const payload = (await response.json()) as { connections: typeof connections };
        setConnections(payload.connections ?? []);
      }
      setLoadingConnections(false);
    };

    void loadConnections();
  }, []);

  const connectionHealth = useMemo(() => {
    if (connections.length === 0) return "No connected locations yet";
    const expired = connections.filter((item) => {
      if (!item.expires_at) return false;
      return new Date(item.expires_at).getTime() < Date.now();
    }).length;
    if (expired === 0) return "All connection tokens healthy";
    return `${expired} token${expired === 1 ? "" : "s"} need reconnection`;
  }, [connections]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Configure profile, alerts, and detection behavior</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="detection">Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@business.com" />
              </div>
              <div className="grid gap-2">
                <Label>Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern (EST)</SelectItem>
                    <SelectItem value="eet">East Africa (EAT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Business Connections</CardTitle>
              <CardDescription>
                One-click Google OAuth setup. We discover your locations automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                <p className="font-medium text-indigo-900">How automatic setup works</p>
                <p className="mt-1 text-sm text-indigo-800">
                  1) Click Connect with Google. 2) Approve access. 3) We auto-import your business locations and start monitoring.
                </p>
              </div>

              {gbpStatus === "connected" ? (
                <p className="text-sm text-emerald-700">Google Business connected successfully.</p>
              ) : null}
              {gbpStatus === "error" ? (
                <p className="text-sm text-red-700">
                  Connection failed. Retry with Google, then use support if the issue persists.
                </p>
              ) : null}

              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium text-slate-900">Connection health</p>
                <p className="text-sm text-slate-500">{connectionHealth}</p>
              </div>

              <div className="space-y-3">
                {loadingConnections ? (
                  <p className="text-sm text-slate-500">Loading connected locations...</p>
                ) : connections.length === 0 ? (
                  <p className="text-sm text-slate-500">No locations connected yet.</p>
                ) : (
                  connections.map((connection) => (
                    <div key={connection.id} className="rounded-lg border border-slate-200 p-4">
                      <p className="font-medium text-slate-900">
                        {connection.location_name ?? connection.location_id}
                      </p>
                      <p className="text-sm text-slate-500">
                        Account {connection.account_id} · Location {connection.location_id}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    window.location.href = "/api/gbp/connect";
                  }}
                >
                  Connect with Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = "/api/gbp/connect";
                  }}
                >
                  Reconnect
                </Button>
              </div>

              <p className="text-xs text-slate-500">
                If automatic connect fails, contact support with your Google Business profile URL and we will assist with manual onboarding.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose when and how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Email Alerts</p>
                  <p className="text-sm text-slate-500">Get suspicious review alerts by email</p>
                </div>
                <Checkbox defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">SMS Alerts</p>
                  <p className="text-sm text-slate-500">Get urgent attack alerts by SMS</p>
                </div>
                <Checkbox />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Weekly Digest</p>
                  <p className="text-sm text-slate-500">Receive a weekly summary report</p>
                </div>
                <Checkbox defaultChecked />
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detection">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Detection Settings</CardTitle>
              <CardDescription>Tune model sensitivity and automation thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                <Label>Sensitivity</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select sensitivity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label>Auto-flag Threshold</Label>
                  <span className="text-sm font-medium text-slate-700">{threshold[0]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={threshold[0]}
                  onChange={(event) => setThreshold([Number(event.target.value)])}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Auto-generate evidence package</p>
                  <p className="text-sm text-slate-500">Generate evidence when score exceeds threshold</p>
                </div>
                <Checkbox defaultChecked />
              </div>

              <Button className="bg-indigo-600 hover:bg-indigo-700">Save Detection Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const invoices = [
  { date: "2026-03-01", description: "Starter Plan - Monthly", amount: "$19.00", status: "Paid" },
  { date: "2026-02-01", description: "Starter Plan - Monthly", amount: "$19.00", status: "Paid" },
  { date: "2026-01-01", description: "Starter Plan - Monthly", amount: "$19.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing & Plans</h1>
        <p className="text-slate-500">Manage subscription, payment method, and invoices</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription and usage</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold text-slate-900">Starter Plan</p>
              <Badge className="bg-indigo-100 text-indigo-700">Active</Badge>
            </div>
            <p className="text-sm text-slate-500">$19/month · Renews on Apr 12, 2026</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-600">
            <p>Locations used: 2/3</p>
            <p>Monthly scans: Unlimited</p>
          </div>
          <div className="flex gap-3 md:col-span-2">
            <Button className="bg-indigo-600 hover:bg-indigo-700">Upgrade Plan</Button>
            <Button variant="outline">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Default method for renewals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="font-medium text-slate-900">Visa ending in 4242</p>
            <p className="text-sm text-slate-500">Expires 08/2029</p>
          </div>
          <Button variant="outline">Update Payment Method</Button>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Past payments and downloadable invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.date} className="flex flex-col gap-2 rounded-lg border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{invoice.description}</p>
                  <p className="text-sm text-slate-500">{invoice.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-900">{invoice.amount}</span>
                  <Badge className="bg-emerald-100 text-emerald-700">{invoice.status}</Badge>
                  <Button size="sm" variant="outline">Invoice PDF</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

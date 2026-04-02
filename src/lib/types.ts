export type RiskLevel = "critical" | "high" | "medium" | "low";

export type ReviewStatus = "pending" | "flagged" | "reported" | "legitimate";

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
  platform: string;
  location: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: ReviewStatus;
  detection: string;
  accountId?: string;
  locationId?: string;
  googleReviewId?: string;
  isKnownCustomer?: boolean;
  customerVerificationNotes?: string;
}

export interface AlertItem {
  id: string;
  type: "suspicious" | "spike" | "removed" | "decision" | "digest";
  title: string;
  description: string;
  time: string;
  severity: "critical" | "high" | "success" | "info";
  reviewId?: string;
  read: boolean;
}

export interface DashboardSummary {
  totalReviews: number;
  fakeDetected: number;
  removedSuccessfully: number;
  healthScore: number;
  recentReviews: Review[];
}

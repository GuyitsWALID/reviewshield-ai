import type { RiskLevel, ReviewStatus } from "@/lib/types";

const GENERIC_PHRASES = [
  "terrible service",
  "worst experience",
  "stay away",
  "complete scam",
  "waste of time",
  "never coming back",
  "do not recommend",
  "highly recommend",
  "best service ever",
  "fake business",
  "they stole my money",
  "avoid this place",
];

const EXTREME_WORDS = [
  "scam",
  "fraud",
  "stole",
  "never",
  "worst",
  "trash",
  "awful",
  "fake",
  "beware",
  "lawsuit",
  "criminal",
];

const POSITIVE_WORDS = ["great", "excellent", "amazing", "friendly", "perfect", "good"];
const NEGATIVE_WORDS = ["terrible", "awful", "bad", "worst", "rude", "disgusting"];

export interface DetectionReviewInput {
  id: string;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
  location: string;
  platform: string;
}

export interface DetectionContext {
  recentReviews: DetectionReviewInput[];
}

export interface DetectionResult {
  riskScore: number;
  riskLevel: RiskLevel;
  status: ReviewStatus;
  detectionReason: string;
  triggeredSignals: string[];
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeText(content: string) {
  return content.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function wordSet(content: string) {
  return new Set(normalizeText(content).split(" ").filter(Boolean));
}

function jaccardSimilarity(a: string, b: string) {
  const setA = wordSet(a);
  const setB = wordSet(b);
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection += 1;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function isPositiveText(content: string) {
  const low = content.toLowerCase();
  return POSITIVE_WORDS.some((word) => low.includes(word));
}

function isNegativeText(content: string) {
  const low = content.toLowerCase();
  return NEGATIVE_WORDS.some((word) => low.includes(word));
}

function toRiskLevel(score: number): RiskLevel {
  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}

function statusFromRisk(riskLevel: RiskLevel): ReviewStatus {
  if (riskLevel === "critical" || riskLevel === "high") return "pending";
  if (riskLevel === "medium") return "flagged";
  return "legitimate";
}

export function detectFakeReview(
  review: DetectionReviewInput,
  context: DetectionContext
): DetectionResult {
  const low = review.content.toLowerCase();
  const contentLength = review.content.trim().length;
  const exclamationCount = (review.content.match(/!/g) ?? []).length;
  const allCapsWords = (review.content.match(/\b[A-Z]{4,}\b/g) ?? []).length;
  const repeatedChars = /(.)\1{3,}/.test(review.content);
  const mentionCount = GENERIC_PHRASES.filter((phrase) => low.includes(phrase)).length;
  const extremeCount = EXTREME_WORDS.filter((word) => low.includes(word)).length;

  let score = 8;
  const signals: string[] = [];

  if (mentionCount > 0) {
    score += 10 + mentionCount * 8;
    signals.push("template-like wording appears in known fake-review phrase set");
  }

  if (extremeCount > 0) {
    score += 10 + extremeCount * 6;
    signals.push("contains unusually extreme accusation language");
  }

  if (exclamationCount >= 3) {
    score += 10;
    signals.push("excessive punctuation intensity");
  }

  if (allCapsWords >= 2) {
    score += 8;
    signals.push("multiple all-caps emphasis blocks");
  }

  if (repeatedChars) {
    score += 6;
    signals.push("contains repeated character spam patterns");
  }

  if (contentLength > 0 && contentLength < 30 && review.rating <= 2) {
    score += 12;
    signals.push("very short low-rating review with low detail");
  }

  if (review.rating <= 2 && isPositiveText(review.content)) {
    score += 8;
    signals.push("rating and sentiment mismatch");
  }

  if (review.rating >= 4 && isNegativeText(review.content)) {
    score += 8;
    signals.push("rating and sentiment mismatch");
  }

  const createdAtMs = Number.isNaN(new Date(review.createdAt).getTime())
    ? Date.now()
    : new Date(review.createdAt).getTime();

  const locationRecent = context.recentReviews.filter((item) => {
    if (item.location !== review.location) return false;
    const itemTime = new Date(item.createdAt).getTime();
    return Math.abs(createdAtMs - itemTime) <= 60 * 60 * 1000;
  });

  const lowRatingBurstCount = locationRecent.filter((item) => item.rating <= 2).length + (review.rating <= 2 ? 1 : 0);
  if (lowRatingBurstCount >= 3) {
    score += 16;
    signals.push("temporal burst of low-star reviews at the same location");
  }

  const authorReviews = context.recentReviews.filter(
    (item) => item.author.toLowerCase() === review.author.toLowerCase()
  );
  if (authorReviews.length === 0 && review.rating <= 2 && extremeCount > 0) {
    score += 7;
    signals.push("new reviewer behavior combined with high-intensity language");
  }

  const recentSameLocation = context.recentReviews
    .filter((item) => item.location === review.location)
    .slice(0, 40);

  let maxSimilarity = 0;
  for (const candidate of recentSameLocation) {
    const sim = jaccardSimilarity(review.content, candidate.content);
    if (sim > maxSimilarity) maxSimilarity = sim;
  }
  if (maxSimilarity >= 0.82) {
    score += 22;
    signals.push("near-duplicate wording detected across multiple reviews");
  } else if (maxSimilarity >= 0.68) {
    score += 12;
    signals.push("high textual similarity to another recent review");
  }

  const riskScore = clamp(Math.round(score), 1, 99);
  const riskLevel = toRiskLevel(riskScore);
  const status = statusFromRisk(riskLevel);

  const primarySignals = signals.slice(0, 3);
  const detectionReason =
    primarySignals.length > 0
      ? `Detected signals: ${primarySignals.join("; ")}.`
      : "No suspicious signals detected by hybrid rule analysis.";

  return {
    riskScore,
    riskLevel,
    status,
    detectionReason,
    triggeredSignals: signals,
  };
}

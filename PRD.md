# Product Requirements Document (PRD)

## ReviewShield AI

**Version:** 1.0 (MVP Launch)
**Date:** March 25, 2026
**Author:** Grok (xAI) for Walid Murad / WaliyawTech
**Status:** Draft – Ready for review & iteration

---

## 1. Executive Summary

ReviewShield AI is a subscription-based SaaS tool that automatically detects and defends against fake review attacks on Google Business Profiles (GBP) / Google Maps listings. SMBs lose thousands in revenue from review bombing, yet Google's native tools are slow, inconsistent, and offer no proactive defense. ReviewShield uses hybrid AI (rules + BERT + graph neural networks) to flag suspicious reviews in real-time, auto-generate Google appeal packages, suggest smart replies, and deliver a "Review Health Score" dashboard.

**Core value proposition:** "Google's missing fake-review bodyguard – affordable, set-it-and-forget-it protection for any SMB with a Google listing."

**Monetization:** Freemium → tiered subscriptions ($19–$99/mo) with high retention via recurring protection.

**Target MRR at 6 months:** $5K–$15K (50–150 paying users).

**Differentiation:** Pure focus on fake detection (not just management) + SMB price point vs. enterprise tools like Birdeye/Podium.

---

## 2. Problem Statement & Opportunity

### Pain Points (validated from Google Small Biz thread + 2026 market)

- Fake review attacks (1-star bombing, competitor sabotage, extortion scams) are rising with LLM spam.
- Manual flagging is slow; Google removes only ~some fakes (240M+ in 2024, still gaps in 2026).
- SMBs lack time/expertise for monitoring, reporting, or responding.
- No affordable real-time alert + evidence tool exists for <10-location businesses.

### Market Opportunity

- Millions of Google Business Profiles globally (especially local services, retail, restaurants).
- Competitors (Birdeye, Reputation.com, Local Viking) focus on broad reputation management; none lead with advanced fake-detection AI at SMB pricing.
- Google API limitations create the exact gap we fill: we read/reply, but we analyze + package evidence for faster Google removal.

### Business Goal

Build a sticky, high-LTV SaaS that becomes the default "review insurance" for SMBs.

---

## 3. Objectives & Success Metrics

### Primary OKRs (6-month launch)

- **Adoption:** 1,000 sign-ups, 200 paying users.
- **Retention:** <15% monthly churn.
- **Product:** 90%+ detection accuracy (user-confirmed fakes).
- **Business:** $8K MRR, 40% gross margin.

### Key Metrics (tracked in-app)

- Reviews scanned per user/month
- Fake reviews detected & successfully removed (Google confirmation)
- Review Health Score improvement
- NPS ≥ 70
- ROI dashboard: "Revenue protected" (est. based on avg. review impact)

---

## 4. Target Audience & Personas

### Primary

Small-to-medium business owners/managers (1–50 employees) with Google Business Profiles.

- **Industries:** Restaurants, retail, services, clinics, agencies, local trades.
- **Geography:** Global (English-first; easy localization for Ethiopia/East Africa).
- **Pain tolerance:** Non-technical, time-poor, revenue-sensitive.

### Personas

1. **Maria the Restaurant Owner** – 3 locations, 50+ reviews/month, terrified of 1-star bombs.
2. **Ahmed the Auto Repair Shop** – Single location, relies 80% on Maps traffic.
3. **Sara the Recruitment Agency Owner** – Multi-location, needs fast interview-related review triage (future expansion).

### Secondary

Google Partners / marketing agencies (white-label upsell).

---

## 5. Features & Requirements

### MVP (Phase 1 – Launch in 4–6 weeks)

| Priority | Feature | Description | Success Criteria |
|----------|---------|-------------|------------------|
| Must-have | Google OAuth Connect | Secure login + multi-location selection | Supports 1–10 locations |
| Must-have | Real-time Review Ingestion | Poll/list reviews via GBP API every 15 min (or webhook if available) | No missed reviews |
| Must-have | Hybrid Fake Detection Engine | 1. Rule-based (bursts, generic text, new reviewers, timing)<br>2. BERT sentiment + stylometry<br>3. Burst + graph clustering (lightweight) | 85%+ accuracy on labeled test set |
| Must-have | Dashboard – Review Health Score | Overall score + list of flagged reviews with confidence % + evidence | Visual + exportable |
| Must-have | One-click Actions | • Auto-reply templates (tone-matched)<br>• Generate Google Report Package (PDF with signals)<br>• Hide low-quality (where possible) | User saves ≥30 min/week |
| Must-have | Email/SMS Alerts | Instant notification on attack detection | Configurable thresholds |
| Should-have | Free Tier Limits | 1 location, 50 scans/mo, basic rules only | Hooks users into paid |

### Post-MVP Roadmap (v1.1–v2)

- **v1.1 (Month 2–3):** Competitor benchmarking, historical trend graphs, payment reminder add-on.
- **v1.2 (Month 4):** Full GNN spam-farm detection, website security scan integration.
- **v2 (Month 6+):** Support ticket triage, multi-platform (Yelp/TripAdvisor), agency multi-client dashboard.

### Out of Scope (MVP)

Direct review deletion (impossible via API), review collection/request tools.

---

## 6. User Stories & Flows

### Core Journey (Onboarding → Daily Use)

1. Sign up → Connect Google account (OAuth) → Select locations.
2. AI scans existing + new reviews → Dashboard populates.
3. New suspicious review → Alert + "Review this" button.
4. User clicks → Sees breakdown → Chooses "Auto-reply" or "Report to Google" (pre-filled).
5. Weekly digest email: "You protected 7 fake reviews this week."

### Acceptance Criteria (example)

- As a business owner, I can connect my GBP in <2 minutes.
- As a user, every flagged review shows "Why flagged" in plain English.
- As an admin, I can export all data for legal use.

---

## 7. Technical Requirements & Integrations

### Core Stack (scalable, low-cost)

- **Frontend:** Next.js / React + Tailwind (dashboard).
- **Backend:** FastAPI (Python) or Node.js.
- **AI/ML:** Hugging Face (BERT) + lightweight GNN (PyG/DGL) → later Gemini/Claude API for advanced prompts.
- **Database:** Supabase / Postgres (review history + user data).
- **Auth:** Google OAuth2 + Clerk/Supabase Auth.
- **Hosting:** Vercel + AWS (or Railway for quick start).
- **Monitoring:** Sentry + PostHog analytics.

### Integrations

- **Primary:** Google Business Profile API (v4)
  - `accounts.locations.reviews.list` & `batchGetReviews`
  - Reply endpoint
  - (No delete/report endpoint – we generate user-ready reports)

- **Future:** Stripe (payments), Twilio (SMS), email (Resend).

### Data Privacy

GDPR/CCPA compliant; anonymized aggregate data for model improvement (opt-in).

---

## 8. Non-Functional Requirements

- **Performance:** Scan ≤10k reviews/location in <60s; real-time alerts <5 min.
- **Scalability:** 10k users / 100k locations (multi-tenant).
- **Reliability:** 99.9% uptime; graceful API rate-limit handling.
- **Security:** Encrypted API keys; SOC2-ready.
- **Accessibility:** WCAG 2.1 AA.
- **Localization:** English first; RTL/Amharic support planned.

---

## 9. Pricing & Monetization Model

### Freemium (proven hook)

- **Free:** 1 location, basic rules, 5 reports/mo.
- **Starter – $19/mo** (or $190/yr): 3 locations, full AI, unlimited scans/alerts.
- **Pro – $49/mo:** Unlimited locations, GNN + competitor tracking, priority support, API access.
- **Agency – $99+/mo:** Multi-client dashboard, white-label, custom training.

### Additional Revenue

- One-time onboarding setup ($99).
- Annual discount (20%).
- Affiliate program for Google Partners.

### Billing

Stripe (global + local Ethiopia options via Chapa/Paystack if expanding).

---

## 10. Go-to-Market & Launch Plan

### Launch Channels

- Product Hunt, X (target original thread commenters), Google Small Biz Facebook groups, cold DM early adopters.

### Marketing

- SEO blog ("How to fight 2026 Google review bombing"), free review audit tool as lead magnet.

### Sales

Self-serve + high-touch for agencies.

---

## 11. Assumptions, Risks & Dependencies

### Assumptions

- Google API remains stable; fake-review problem persists.

### Risks & Mitigations

- **API changes** → Monitor Google dev console + fallback polling.
- **False positives** → User "Confirm/Reject" feedback loop for continuous learning.
- **Low adoption** → Launch with 10 beta users from original X thread.

### Dependencies

- Google OAuth approval, Stripe account, initial labeled dataset (Yelp + synthetic).

---

## 12. Appendix

### Detection Techniques Summary (from prior exploration)

Rules → Traditional ML → BERT → GNN hybrids.

### Competitor Gap Analysis

Birdeye et al. do broad management; we own "fake detection + protection" niche.

### Next Steps

1. Stakeholder review (you + dev team).
2. Wireframes (I can generate next).
3. MVP backlog in Linear/Notion.
4. Pseudocode / prototype (ready on request).


                       
claude --resume 19aec4c3-4c61-4f67-8a81-0d0735ac6fc3
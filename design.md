# ReviewShield AI - Design Specification

## Overview
This document outlines the complete design system and UI specifications for ReviewShield AI, a B2B SaaS platform for detecting and managing fake reviews on Google Business Profiles for SMBs.

---

## Design Principles

1. **Trust & Security** - The UI should convey reliability and protection
2. **Clarity** - Complex detection data presented simply
3. **Action-Oriented** - Quick actions for flagging, reporting, and responding
4. **Professional** - Clean, modern aesthetic suitable for business users

---

## Color Palette

### Primary Colors
| Role | Color | Hex |
|------|-------|-----|
| Primary | Deep Indigo | `#4F46E5` |
| Primary Hover | Indigo 600 | `#4338CA` |
| Primary Light | Indigo 50 | `#EEF2FF` |

### Semantic Colors
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Danger/High Risk | Red | `#EF4444` | Critical alerts, high-risk reviews |
| Warning/Medium Risk | Amber | `#F59E0B` | Medium-risk indicators |
| Success/Safe | Emerald | `#10B981` | Confirmed legitimate, positive trends |
| Info/Low Risk | Sky Blue | `#0EA5E9` | Low-risk badges, informational |

### Neutral Colors
| Role | Color | Hex |
|------|-------|-----|
| Background | White | `#FFFFFF` |
| Background Alt | Slate 50 | `#F8FAFC` |
| Surface | White | `#FFFFFF` |
| Border | Slate 200 | `#E2E8F0` |
| Text Primary | Slate 900 | `#0F172A` |
| Text Secondary | Slate 500 | `#64748B` |
| Text Muted | Slate 400 | `#94A3B8` |

### Dark Mode
| Role | Color | Hex |
|------|-------|-----|
| Background | Slate 950 | `#020617` |
| Surface | Slate 900 | `#0F172A` |
| Border | Slate 800 | `#1E293B` |
| Text Primary | Slate 50 | `#F8FAFC` |
| Text Secondary | Slate 400 | `#94A3B8` |

---

## Typography

### Font Families
- **Headlines**: `Inter` - Clean, modern sans-serif
- **Body**: `Inter` - Highly legible at all sizes
- **Monospace** (for IDs/codes): `JetBrains Mono`

### Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 36px / 2.25rem | 700 | 1.2 |
| H2 | 30px / 1.875rem | 600 | 1.25 |
| H3 | 24px / 1.5rem | 600 | 1.3 |
| H4 | 20px / 1.25rem | 500 | 1.4 |
| Body | 16px / 1rem | 400 | 1.5 |
| Small | 14px / 0.875rem | 400 | 1.5 |
| Caption | 12px / 0.75rem | 400 | 1.4 |

---

## Spacing System
Base unit: 4px

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |

---

## Border Radius
| Token | Value |
|-------|-------|
| sm | 4px |
| md | 8px |
| lg | 12px |
| xl | 16px |
| full | 9999px |

---

## Page Specifications

### 1. Landing Page (Public)

#### Layout Structure
- **Navigation**: Fixed top, full-width, height 64px
- **Hero Section**: Full viewport height minus nav
- **Features Section**: 3-column grid on desktop
- **How It Works**: 3-step horizontal flow
- **Pricing Section**: 3-tier card layout
- **Footer**: Multi-column with links

#### Navigation Bar
```
[Logo] [Features] [Pricing] [How It Works]     [Sign In] [Get Started]
```
- Logo: "ReviewShield" with shield icon
- CTAs: Sign In (ghost), Get Started (primary gradient)

#### Hero Section
- **Badge**: "AI-Powered Fake Review Detection" pill
- **Headline**: "Protect Your Business From Fake Reviews"
- **Subheadline**: "Detect, analyze, and remove fake reviews before they hurt your reputation. The only AI-powered platform built for SMBs."
- **Primary CTA**: "Start Free Trial" (gradient button)
- **Secondary CTA**: "Watch Demo" (outline button)
- **Trust Indicators**: "Trusted by 500+ businesses" with logos
- **Background**: Dark gradient with subtle grid pattern

#### Features Grid
1. **AI Detection Engine**
   - Icon: Brain/Neural network
   - Description: "Hybrid AI analyzes reviews using rules + BERT + behavioral patterns"

2. **Evidence Package Generator**
   - Icon: Document/Report
   - Description: "Auto-generate PDF reports with proof for Google removal requests"

3. **Real-Time Alerts**
   - Icon: Bell/Notification
   - Description: "Get instant notifications when suspicious reviews appear"

4. **Multi-Platform Monitoring**
   - Icon: Globe
   - Description: "Monitor Google, Yelp, and Facebook from one dashboard"

5. **Transparent Scoring**
   - Icon: Chart/Analytics
   - Description: "See exactly why each review was flagged with confidence scores"

6. **Smart Responses**
   - Icon: Message/Chat
   - Description: "AI-generated reply suggestions for every review"

#### Pricing Section
| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0/mo | 1 location, 50 scans/mo, basic rules |
| **Starter** | $19/mo | 3 locations, full AI, unlimited scans, alerts |
| **Pro** | $49/mo | Unlimited locations, GNN detection, priority support, API access |

#### Footer
- Company: About, Careers, Blog
- Product: Features, Pricing, API Docs
- Resources: Help Center, Community, Status
- Legal: Privacy, Terms, Security
- Social: Twitter, LinkedIn

---

### 2. Authentication Pages

#### Sign In Page
- **Layout**: Centered card on gradient background
- **Elements**:
  - Logo at top
  - "Welcome Back" heading
  - Email input with icon
  - Password input with icon + show/hide toggle
  - "Remember me" checkbox
  - "Forgot password?" link
  - Sign In button (primary)
  - Divider with "or"
  - "Continue with Google" button
  - "Don't have an account? Sign Up" link

#### Sign Up Page
- **Layout**: Centered card on gradient background
- **Elements**:
  - Logo at top
  - "Create your account" heading
  - Full name input
  - Email input
  - Password input with strength indicator
  - Confirm password input
  - Terms checkbox
  - Create Account button (primary)
  - "Continue with Google" button
  - "Already have an account? Sign In" link

---

### 3. Dashboard (Authenticated)

#### Layout Structure
```
┌──────────────────────────────────────────────────────────┐
│  [Sidebar]  │  [Top Bar]                                │
│             │  Search | Notifications | Profile         │
│  Logo       ├──────────────────────────────────────────┤
│             │                                            │
│  Navigation │  [Content Area]                            │
│  - Dashboard│                                            │
│  - Reviews  │                                            │
│  - Alerts   │                                            │
│  - Evidence │                                            │
│  - Settings │                                            │
│  - Billing  │                                            │
│             │                                            │
└──────────────────────────────────────────────────────────┘
```

#### Sidebar (280px width, collapsible to 72px)
- Logo at top
- User avatar + name at bottom
- Navigation items with icons
- Active state: Primary background, white text
- Hover state: Slate 100 background
- Collapse toggle button

#### Top Bar (64px height)
- Search input (expandable)
- Notification bell with badge count
- User avatar dropdown menu

#### Dashboard Home

##### Stats Cards Row (4 columns)
1. **Total Reviews**
   - Value: "1,234"
   - Label: "Total Reviews"
   - Trend: "+12% this month"

2. **Fake Detected**
   - Value: "23"
   - Label: "Fake Reviews Detected"
   - Trend: "-5% this month"
   - Color: Danger red

3. **Removed Successfully**
   - Value: "18"
   - Label: "Successfully Removed"
   - Trend: "+78% success rate"

4. **Health Score**
   - Value: "85/100"
   - Label: "Review Health"
   - Visual: Circular progress ring

##### Main Content Area

##### Quick Actions Bar
- [Scan Now] button
- [View All Reviews] button
- [Generate Report] button

##### Recent Reviews Table
- Columns: Review | Rating | Source | Risk Score | Status | Date | Actions
- Row actions: View Details, Flag as Fake, Reply, Hide
- Filters: All, Flagged, Pending, Resolved
- Search: By review content, author

##### Risk Score Badges
| Level | Color | Score Range |
|-------|-------|-------------|
| Critical | Red | 85-100% |
| High | Orange | 65-84% |
| Medium | Amber | 35-64% |
| Low | Green | 0-34% |

---

### 4. Reviews Page

#### Layout
```
┌──────────────────────────────────────────────────────────┐
│  [Sidebar]  │  Page Header                               │
│             │  Reviews | Filters | Export                 │
│             ├──────────────────────────────────────────┤
│             │  [Filter Bar]                              │
│             │  Platform | Risk Level | Date | Status     │
│             ├──────────────────────────────────────────┤
│             │  [Reviews Table/List]                      │
│             │                                            │
└──────────────────────────────────────────────────────────┘
```

#### Review Card (List Item)
```
┌─────────────────────────────────────────────────────────┐
│ [Avatar] Reviewer Name          [Risk Badge] [Date]    │
│         @username                                       │
├─────────────────────────────────────────────────────────┤
│ ★★★★☆ (4 stars)                                        │
├─────────────────────────────────────────────────────────┤
│ "Review text content..."                                │
├─────────────────────────────────────────────────────────┤
│ Platform: Google | Location: Main St                     │
│ Detection: 87% confidence - Template language detected   │
├─────────────────────────────────────────────────────────┤
│ [View] [Reply] [Flag] [Report to Google] [Hide]        │
└─────────────────────────────────────────────────────────┘
```

#### Review Detail Modal
- Full review text
- Reviewer profile (avatar, name, reviews count, account age)
- Detection breakdown:
  - Overall score (0-100)
  - Contributing factors (checkmarks for each detected pattern)
  - AI explanation in plain English
- Action buttons: Reply, Flag Fake, Generate Evidence, Report to Google

---

### 5. Alerts Page

#### Layout
```
┌──────────────────────────────────────────────────────────┐
│  [Sidebar]  │  Page Header                               │
│             │  Alerts | Mark all read                   │
│             ├──────────────────────────────────────────┤
│             │  [Alerts List]                            │
│             │                                            │
│             │  🔴 New suspicious review on Main St      │
│             │     2 hours ago                           │
│             │                                            │
│             │  🟠 Review spike detected                  │
│             │     Yesterday                             │
│             │                                            │
│             │  🟢 Google removed flagged review          │
│             │     3 days ago                            │
│             │                                            │
└──────────────────────────────────────────────────────────┘
```

#### Alert Card
- Icon indicating type (suspicious review, spike, removal, etc.)
- Title + description
- Timestamp
- Severity indicator (Critical/High/Medium/Low)
- Action: "View Review" button
- Dismiss button

#### Alert Types
1. **New Suspicious Review** - Red alert
2. **Review Spike Detected** - Orange alert
3. **Successfully Removed** - Green alert
4. **Google Decision** - Blue alert
5. **Weekly Digest** - Purple alert

---

### 6. Evidence Generator Page

#### Layout
```
┌──────────────────────────────────────────────────────────┐
│  [Sidebar]  │  Page Header                               │
│             │  Evidence Package                          │
│             ├──────────────────────────────────────────┤
│             │  [Selected Review Summary]                │
│             │                                            │
│             ├──────────────────────────────────────────┤
│             │  [Evidence Components]                    │
│             │                                            │
│             │  □ AI Confidence Score                    │
│             │  □ Stylometric Analysis                   │
│             │  □ Reviewer Profile Data                 │
│             │  □ Temporal Analysis                      │
│             │  □ Similarity Report                     │
│             │                                            │
│             ├──────────────────────────────────────────┤
│             │  [Preview] [Download PDF] [Copy to Google]│
└──────────────────────────────────────────────────────────┘
```

#### PDF Output Structure
1. Cover page with business info
2. Executive summary
3. Review in question
4. Detection methodology
5. Confidence breakdown
6. Supporting evidence
7. Recommendation for removal

---

### 7. Settings Page

#### Tabs Layout
- **Profile** - Name, email, avatar
- **Business** - Connected accounts, locations
- **Notifications** - Email, SMS, webhook settings
- **Detection** - Sensitivity thresholds, custom rules
- **Team** - Invite members, role management (Pro only)
- **API** - API keys, webhooks (Pro only)

#### Settings Sections

##### Profile Settings
- Avatar upload
- Full name
- Email
- Password change
- Timezone selection

##### Notification Settings
- Email notifications toggle
- SMS notifications toggle
- Alert threshold slider
- Daily digest toggle
- Weekly report toggle

##### Detection Settings
- Sensitivity: Low / Medium / High
- Auto-flag threshold: 0-100 slider
- Auto-generate evidence toggle
- Enable behavioral analysis toggle

---

### 8. Billing Page

#### Layout
```
┌──────────────────────────────────────────────────────────┐
│  [Sidebar]  │  Page Header                               │
│             │  Billing & Plans                           │
│             ├──────────────────────────────────────────┤
│             │  [Current Plan Card]                       │
│             │                                            │
│             ├──────────────────────────────────────────┤
│             │  [Plan Comparison]                         │
│             │                                            │
│             ├──────────────────────────────────────────┤
│             │  [Payment Method]                        │
│             │                                            │
│             ├──────────────────────────────────────────┤
│             │  [Billing History]                        │
│             │                                            │
└──────────────────────────────────────────────────────────┘
```

#### Plan Card
- Current plan name + price
- Renewal date
- Usage: X of Y locations used
- Usage: X of Z scans used
- [Upgrade Plan] button
- [Cancel Subscription] link

#### Payment Method
- Current card (last 4 digits)
- [Update Payment Method] button
- Billing address

#### Billing History Table
- Date | Description | Amount | Status | Invoice
- Download PDF invoices

---

## Component Specifications

### Buttons
| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| Primary | #4F46E5 | White | None | Main CTAs |
| Secondary | #1E293B | White | None | Secondary actions |
| Outline | Transparent | #4F46E5 | #4F46E5 | Tertiary actions |
| Ghost | Transparent | #64748B | None | Subtle actions |
| Danger | #EF4444 | White | None | Destructive actions |

### Button Sizes
- sm: h-9 px-3 text-sm
- md: h-10 px-4 text-sm
- lg: h-12 px-6 text-base

### Form Inputs
- Height: 40px (md), 48px (lg)
- Border: 1px solid #E2E8F0
- Border radius: 8px
- Focus: Ring 2px #4F46E5

### Cards
- Background: White
- Border: 1px solid #E2E8F0
- Border radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 24px

### Badges/Pills
- Border radius: 9999px (full)
- Padding: 4px 12px
- Font: 12px semibold

### Data Tables
- Header: bg-slate-50, font-semibold
- Row hover: bg-slate-50
- Border between rows: 1px solid #F1F5F9

---

## Animation Specifications

### Transitions
- Default: 150ms ease-in-out
- Page transitions: 300ms ease-out
- Modal: 200ms ease-out

### Micro-interactions
- Button press: scale(0.98)
- Hover lift: translateY(-1px)
- Badge pulse: opacity animation for new items
- Success checkmark: draw animation

### Loading States
- Skeleton screens for data loading
- Spinner for actions (20px, primary color)
- Progress bar for scans (4px height)

---

## Responsive Breakpoints
| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640-1024px | Collapsible sidebar |
| Desktop | > 1024px | Full sidebar |

---

## Accessibility Requirements
- WCAG 2.1 AA compliant
- Keyboard navigation for all interactive elements
- Focus indicators visible
- Color contrast ratio: 4.5:1 minimum
- Screen reader labels for icons
- Reduced motion support

---

## Implementation Notes

### Technology Stack
- Next.js 14+ with App Router
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

### Key Dependencies
- @radix-ui/react-* (accessibility primitives)
- class-variance-authority (button variants)
- date-fns (date formatting)
- recharts (charts/analytics)
- sonner (toast notifications)

### File Structure
```
/app
  /page.tsx              (Landing)
  /(auth)
    /sign-in/page.tsx
    /sign-up/page.tsx
  /(dashboard)
    /layout.tsx          (Sidebar + Topbar)
    /page.tsx            (Dashboard home)
    /reviews/page.tsx
    /alerts/page.tsx
    /evidence/page.tsx
    /settings/page.tsx
    /billing/page.tsx
/components
  /ui                    (shadcn components)
  /landing               (Landing page components)
  /dashboard             (Dashboard components)
/lib
  /utils.ts
  /constants.ts
```
# ReviewShield AI

## Required Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Supabase Tables Expected

The current integration expects these tables (with RLS enabled by `user_id`):

1. `gbp_connections`
2. `reviews`
3. `alerts`
4. `evidence_packages`

### Minimal fields

`gbp_connections`
- `id` text or uuid primary key
- `user_id` uuid
- `account_id` text
- `location_id` text
- `location_name` text
- `access_token` text
- `refresh_token` text
- `expires_at` timestamptz

`reviews`
- `id` text primary key
- `user_id` uuid
- `author_name` text
- `rating` numeric or int
- `comment` text
- `created_at` timestamptz
- `platform` text
- `location_name` text
- `risk_score` numeric or int
- `risk_level` text
- `status` text
- `detection_reason` text
- `account_id` text
- `location_id` text
- `google_review_id` text
- `owner_reply` text

`alerts`
- `id` text or uuid primary key
- `user_id` uuid
- `type` text
- `title` text
- `description` text
- `severity` text
- `review_id` text
- `read` boolean
- `created_at` timestamptz

`evidence_packages`
- `id` uuid primary key (or generated)
- `user_id` uuid
- `review_id` text
- `status` text
- `generated_at` timestamptz
- `summary` jsonb

## Available API Endpoints

- `GET /api/dashboard/summary`
- `GET /api/reviews`
- `GET /api/reviews?sync=true` (pull from GBP + upsert)
- `GET /api/alerts`
- `POST /api/reviews/:reviewId/reply`
- `POST /api/reviews/:reviewId/report`
- `GET /api/evidence/:reviewId` (PDF export)

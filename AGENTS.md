# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mobile-first Next.js (App Router) photo generation app using AI to create profile images with Canadian city/theme presets. Users take photos, select presets (Toronto, Vancouver, Banff, Montreal, "With Us"), and receive 4 AI-generated variations via **Gemini 2.5 Flash Image**.

**Key constraints:**
- No database (credit tracking via Stripe Customer Metadata only)
- No image persistence (results streamed to browser)
- Anonymous preview mode (watermarked, low-res, base64 receipts)
- Credit-based system for full-resolution generations

## Technology Stack

- **Next.js App Router** + TypeScript
- **Clerk** for authentication
- **Stripe** for payments and credit metadata storage
- **Google Gemini 2.5 Flash Image** (`@google/generative-ai`) for AI generation
- **sharp** for image processing and watermarking
- **shadcn/ui** + **Tailwind CSS** for UI components
- **Figma MCP** for design references (configured in .mcp.json)
- Vercel deployment (PWA-ready)

## Critical Architecture Patterns

### Supabase Import Rules (from global CLAUDE.md)
- **Server Components**: Import from `@supabase/ssr` or `supabase/server`
- **Client Components** (marked `'use client'`): Import from `supabase/client`

### Component Documentation
When creating new components, add documentation at the top describing purpose and capabilities.

### Credit Management (Stripe-Only, No DB)

All credit operations use Stripe Customer Metadata fields:
- `credits` — remaining generation credits
- `total_gens` — cumulative count
- `last_gen_at` — ISO timestamp
- `last_preset` — last used preset name
- `last_event_id` — Stripe webhook event ID
- `last_bytes` — input size approximation
- `last_hash` — SHA-256 signature fragment

**Critical:** Credit updates must be atomic with mutex locking per customer to prevent race conditions.

### Preview Mode (Anonymous Users)

- One free generation per device/IP/day
- Rate limiting implemented in-memory (use Redis in production)
- Images downscaled to max 768px
- Watermarked in **bottom right corner** with "PhotoApp Preview • [date]"
- Returns base64 receipt (no server persistence)
- No Clerk authentication required

### AI Generation Workflow

**Implementation in `/lib/nb-gemini.ts`:**
1. Uses `@google/generative-ai` SDK with model `gemini-2.5-flash-image`
2. Generates one image per prompt (4 prompts = 4 images)
3. Supports reference images for "With Us" preset
4. Quality parameter currently unused (Gemini uses default settings)
5. Returns images as base64 data URIs

**For each generation:**
1. Validate credits (paid) or eligibility (preview)
2. Decrement credit atomically (if paid)
3. Call Gemini with:
   - Base photo (user upload)
   - Reference images (only for "With Us" preset: `/public/refs/withus_guyA.jpg`, `/public/refs/withus_guyB.jpg`)
   - 4 prompt variants per preset
4. Stream 4 generated images to client
5. Update Stripe metadata with generation details

### Preset Definitions

Each preset in `/lib/presets.ts` defines prompt packs for scene composition:
- **Toronto**: CN Tower compositions
- **Vancouver**: Coastal and mountain settings
- **Banff/Lake Louise**: Alpine lakeside scenes
- **Montreal**: Old-town cobblestone and café shots
- **With Us**: User + 2 reference hosts in Canadian settings (multi-reference mode)

## Environment Variables

Required:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PRICE_GEN_1=price_1SEXEg7C03TsQlWuiyHahgNL
NEXT_PUBLIC_STRIPE_PRICE_GEN_5=price_1SEXEh7C03TsQlWub7G5RS9e
NEXT_PUBLIC_STRIPE_PRICE_GEN_10=price_1SEXEh7C03TsQlWuQNdPPfEo
NB_GEMINI_API_KEY
NEXT_PUBLIC_APP_URL
```

Optional:
```
FIGMA_PERSONAL_ACCESS_TOKEN
```

## Key API Routes Structure

- `/app/api/generate` — Main generation endpoint (credit validation + Gemini call)
- `/app/api/preview` — Anonymous preview (rate limit + watermark)
- `/app/api/credits` — Check current user credits from Stripe
- `/app/api/checkout` — Create Stripe checkout session
- `/app/api/webhooks/stripe` — Handle `checkout.session.completed` for credit increments

## Image Processing

**Watermarking (`/lib/watermark.ts`):**
- Uses `sharp` library for image processing
- Downscales to max 768px (maintains aspect ratio)
- Adds white text watermark in **bottom right corner** with 70% opacity
- Text: "PhotoApp Preview • [date]"
- SVG overlay composite method

## Security Requirements

- Clerk session validation for all paid operations
- Stripe webhook signature verification
- IP-based rate limiting for previews (in-memory, use Redis for production)
- Atomic credit decrement with re-read verification
- Per-customer mutex to prevent concurrent generation overlaps
- No sensitive data in logs or client responses

## Mobile & PWA

- Camera capture: `<input capture="environment">`
- PWA manifest in `/public/manifest.json`
- Mobile-first responsive design
- Offline-capable (service worker via next-pwa)

## File Creation Policy

**From global CLAUDE.md:**
- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing existing files to creating new ones
- NEVER proactively create documentation files (*.md) or READMEs unless explicitly requested

## Reference Assets

- `/public/refs/withus_guyA.jpg` — First reference host for "With Us" preset
- `/public/refs/withus_guyB.jpg` — Second reference host for "With Us" preset

These images must exist and are used only when the "With Us" preset is selected.

## Development Commands

```bash
npm run dev           # Start dev server with Turbopack
npm run build         # Build for production
npm run start         # Start production server
npm run stripe:listen # Listen for Stripe webhooks locally
```

## Implementation Status

✅ **Completed:**
- Gemini 2.5 Flash Image integration
- Image watermarking (bottom right corner)
- Credit management via Stripe metadata
- All UI components and user flows
- Stripe products and prices created

⏳ **Pending:**
- Add actual reference images to `/public/refs/`
- Optional: CAPTCHA for preview endpoint
- Optional: PWA icons

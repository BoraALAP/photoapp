# PhotoApp - AI Profile Generator

A Next.js-based mobile-first web application that generates creative AI profile images using Canadian city presets powered by Nano Banana Gemini 2.5 (NB-G2.5).

## Features

- 🎨 **5 Canadian Presets**: Toronto, Vancouver, Banff/Lake Louise, Montreal, and "With Us"
- 📸 **Mobile Camera Support**: Direct camera capture or file upload
- 🆓 **Anonymous Preview**: Try 1 free watermarked preview per day (no login)
- 💳 **Credit-Based System**: Purchase credits via Stripe for full-resolution generations
- 🔒 **No Database**: Credit tracking via Stripe Customer Metadata only
- 🚫 **No Image Storage**: All images streamed directly to browser
- 📱 **PWA Ready**: Install as mobile app with offline support

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Clerk
- **Payments**: Stripe
- **AI Generation**: Nano Banana Gemini 2.5 (NB-G2.5)
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

\`\`\`env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_GEN_1=price_1SEXEg7C03TsQlWuiyHahgNL
NEXT_PUBLIC_STRIPE_PRICE_GEN_5=price_1SEXEh7C03TsQlWub7G5RS9e
NEXT_PUBLIC_STRIPE_PRICE_GEN_10=price_1SEXEh7C03TsQlWuQNdPPfEo

# Nano Banana Gemini 2.5 API
NB_GEMINI_API_KEY=xxxxx

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Set Up Clerk

1. Create a Clerk application at [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Enable Email, Google, and Apple sign-in providers
3. Copy your publishable and secret keys to `.env.local`

### 4. Set Up Stripe

**Stripe products and prices have already been created via MCP:**

- **Product**: AI Generation Tokens (`prod_TAt0mpe7xI83Ni`)
- **Prices**:
  - 1 Token - $5 CAD: `price_1SEXEg7C03TsQlWuiyHahgNL`
  - 5 Tokens - $20 CAD: `price_1SEXEh7C03TsQlWub7G5RS9e`
  - 10 Tokens - $35 CAD: `price_1SEXEh7C03TsQlWuQNdPPfEo`

**Configure Webhook:**

1. Install Stripe CLI: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. For local development, run:
   \`\`\`bash
   npm run stripe:listen
   \`\`\`
3. For production, add webhook endpoint in Stripe Dashboard:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`

### 5. Add Reference Images

Add two reference images to `/public/refs/` for the "With Us" preset:
- `withus_guyA.jpg`
- `withus_guyB.jpg`

These are the fixed host images that will appear with users in group photos.

### 6. Gemini Image Generation (✅ Implemented)

The Gemini 2.5 Flash Image integration is complete in `/lib/nb-gemini.ts`:
- Uses `@google/generative-ai` SDK
- Generates 4 images (one per prompt variant)
- Supports reference images for "With Us" preset
- Returns images as base64 data URIs

Make sure your `NB_GEMINI_API_KEY` is set in `.env.local`.

### 7. Watermarking (✅ Implemented)

Image watermarking is implemented in `/lib/watermark.ts`:
- Uses `sharp` for image processing
- Downscales to max 768px (maintains aspect ratio)
- Adds "PhotoApp Preview • [date]" watermark in bottom right corner
- White text with 70% opacity for visibility

### 8. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Development Commands

\`\`\`bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run stripe:listen # Listen for Stripe webhooks locally
\`\`\`

## Architecture

### Credit Management

- **No database used** - all credit tracking via Stripe Customer Metadata
- Atomic credit operations with mutex locking
- Fields stored in metadata:
  - `credits`: Remaining credits
  - `total_gens`: Total generations count
  - `last_gen_at`: Last generation timestamp
  - `last_preset`: Last used preset
  - `last_event_id`: Stripe event ID for audit
  - `last_bytes`: Input image size
  - `last_hash`: SHA-256 signature fragment

### User Flows

**Anonymous Preview:**
1. Upload photo → Select preset → Generate preview
2. Receive 4 watermarked low-res images
3. IP-based rate limiting (1 per day)
4. CTA to sign up for full resolution

**Paid Generation:**
1. Sign in with Clerk
2. Purchase credit pack (1/5/10 credits)
3. Upload photo → Select preset → Generate
4. Receive 4 high-resolution images (1 credit deducted)

**"With Us" Preset:**
1. Only available to paid users
2. Combines user photo + 2 reference host images
3. Generates natural group photos in Canadian settings

## API Routes

- `GET /api/credits` - Check user credit balance
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/generate` - Paid generation (requires auth + credits)
- `POST /api/preview` - Anonymous preview (rate-limited, watermarked)
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Security Features

- Clerk session validation for all paid operations
- Stripe webhook signature verification
- IP-based rate limiting for previews
- Atomic credit operations with re-read verification
- Per-customer mutex to prevent race conditions
- No sensitive data in logs or client responses

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Stripe Webhook Configuration

Add production webhook in Stripe Dashboard:
- Endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
- Events: `checkout.session.completed`
- Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## TODO Before Production

- [x] ✅ Implement Gemini 2.5 Flash Image API integration
- [x] ✅ Implement watermarking + downscaling with bottom right watermark
- [ ] Add reference images to `/public/refs/` (withus_guyA.jpg, withus_guyB.jpg)
- [ ] Implement CAPTCHA for preview endpoint (optional)
- [ ] Add PWA icons (`/public/icon-192.png`, `/public/icon-512.png`)
- [ ] Configure Clerk production instance
- [ ] Set up Stripe production webhook
- [ ] Test full user flow end-to-end
- [ ] Add error monitoring (Sentry, LogRocket, etc.)
- [ ] Add analytics (PostHog, Plausible, etc.)

## Support

For issues or questions, refer to:
- Agents.md - Full project specification
- CLAUDE.md - Development guidelines

## License

ISC

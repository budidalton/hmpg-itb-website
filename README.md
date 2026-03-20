## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase Keepalive

If your Supabase project can pause after inactivity, you can keep it warm with:

- Endpoint: `/api/cron/supabase-keepalive`
- Auth: `Authorization: Bearer <CRON_SECRET>`

The route performs a tiny authenticated read against the `reports` table and returns JSON. It is safe to call from cron-job.org.

### Required environment variable

Add this in your deployment environment:

```bash
CRON_SECRET=replace-with-a-long-random-secret
```

### Recommended cron-job.org setup

- URL: `https://your-domain.com/api/cron/supabase-keepalive`
- Method: `GET`
- Header: `Authorization: Bearer YOUR_CRON_SECRET`
- Schedule: once per day

Daily is enough to stay well under Supabase's 7-day inactivity window while keeping load minimal.

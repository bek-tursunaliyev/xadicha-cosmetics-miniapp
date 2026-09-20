# Xadicha Cosmetics — Telegram Mini App

Cosmetics storefront + admin panel as a Telegram Mini App, built with Next.js (App Router, JavaScript) and Neon Postgres.

- Storefront: stories, keyword search, product grid, cart, checkout
- Account: profile, address, order history
- Admin (gated by `ADMIN_TELEGRAM_ID`): products, stories, orders, shop settings
- Auth: Telegram WebApp `initData`, HMAC-validated server-side (`lib/telegram.js`)
- Prices are in UZS (so'm) only

## Local development

```bash
npm install
npm run db:migrate   # applies db/schema.sql to DATABASE_URL
npm run dev
```

Env vars live in `.env.local` (see `.env.example`). Outside production, requests can authenticate
with an `x-dev-telegram-id: <id>` header instead of real Telegram `initData`, so the app can be
clicked through in a normal browser tab while building it — see `lib/telegramClient.js`.

## Telegram bot setup

After deploying, point the bot's webhook and menu button at the live URL:

```bash
npm run telegram:setup
```

Reads `TELEGRAM_BOT_TOKEN`, `APP_URL`, and `TELEGRAM_WEBHOOK_SECRET` from `.env.local`.

## Deployment

Deployed on Vercel with a Neon Postgres database provisioned through the Vercel Marketplace.
`DATABASE_URL` and related vars are injected automatically by that integration; the Telegram
secrets (`TELEGRAM_BOT_TOKEN`, `ADMIN_TELEGRAM_ID`, `TELEGRAM_WEBHOOK_SECRET`, `APP_URL`) are set
via `vercel env add`.

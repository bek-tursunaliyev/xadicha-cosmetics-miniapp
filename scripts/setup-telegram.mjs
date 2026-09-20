// One-time setup: registers the webhook + the persistent Mini App menu button.
// Run with:  npm run telegram:setup
// Requires TELEGRAM_BOT_TOKEN, APP_URL, TELEGRAM_WEBHOOK_SECRET in .env.local

const { TELEGRAM_BOT_TOKEN, APP_URL, TELEGRAM_WEBHOOK_SECRET } = process.env;

if (!TELEGRAM_BOT_TOKEN || !APP_URL || !TELEGRAM_WEBHOOK_SECRET) {
  console.error(
    "Missing env vars. Need TELEGRAM_BOT_TOKEN, APP_URL and TELEGRAM_WEBHOOK_SECRET in .env.local"
  );
  process.exit(1);
}

const api = (method) => `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`;

async function call(method, body) {
  const res = await fetch(api(method), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log(method, JSON.stringify(data));
  if (!data.ok) throw new Error(`${method} failed: ${data.description}`);
  return data;
}

await call("setWebhook", {
  url: `${APP_URL}/api/telegram/webhook`,
  secret_token: TELEGRAM_WEBHOOK_SECRET,
});

await call("setChatMenuButton", {
  menu_button: {
    type: "web_app",
    text: "Do'kon",
    web_app: { url: APP_URL },
  },
});

console.log("Telegram bot configured ✅");

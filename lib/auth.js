import { sql } from "./db";
import { extractInitData, validateInitData } from "./telegram";

/**
 * Authenticates a request using the Telegram WebApp `initData` sent as
 * `Authorization: tma <initData>`. Upserts the Telegram user into our
 * `users` table so profile/address/order-history data has somewhere to live.
 *
 * Returns null when the request is not a valid, freshly-signed Telegram
 * Mini App request — callers should respond 401 in that case.
 */
export async function authenticate(request) {
  let tgUser = null;

  // Dev-only bypass so the app can be clicked through in a normal browser
  // while building it. NODE_ENV is "production" on every Vercel deployment
  // and for `next build`/`next start`, so this branch never runs there.
  if (process.env.NODE_ENV !== "production") {
    const devId = request.headers.get("x-dev-telegram-id");
    if (devId) {
      tgUser = { id: Number(devId), first_name: "Dev", username: `dev${devId}` };
    }
  }

  if (!tgUser) {
    const initData = extractInitData(request);
    const result = validateInitData(initData, process.env.TELEGRAM_BOT_TOKEN);
    if (!result) return null;
    tgUser = result.user;
  }

  const rows = await sql`
    INSERT INTO users (telegram_id, first_name, last_name, username)
    VALUES (${tgUser.id}, ${tgUser.first_name || null}, ${tgUser.last_name || null}, ${tgUser.username || null})
    ON CONFLICT (telegram_id) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      username = EXCLUDED.username,
      updated_at = now()
    RETURNING *
  `;

  const dbUser = rows[0];
  const isAdmin =
    String(tgUser.id) === String(process.env.ADMIN_TELEGRAM_ID);

  return { telegramUser: tgUser, dbUser, isAdmin };
}

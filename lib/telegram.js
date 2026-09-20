import crypto from "node:crypto";

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;

/**
 * Validates Telegram WebApp initData per
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateInitData(initData, botToken) {
  if (!initData || !botToken) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const pairs = [];
  for (const [key, value] of params.entries()) {
    pairs.push(`${key}=${value}`);
  }
  pairs.sort();
  const dataCheckString = pairs.join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const a = Buffer.from(computedHash, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  const authDate = Number(params.get("auth_date") || 0);
  if (!authDate || Date.now() / 1000 - authDate > MAX_AUTH_AGE_SECONDS) {
    return null;
  }

  const userRaw = params.get("user");
  if (!userRaw) return null;

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch {
    return null;
  }
  if (!user?.id) return null;

  return { user, authDate };
}

export function extractInitData(request) {
  const header = request.headers.get("authorization") || "";
  if (header.startsWith("tma ")) return header.slice(4);
  return null;
}

"use client";

const DEV_ID_KEY = "xc_dev_telegram_id";

export function getTelegramWebApp() {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp || null;
}

/** Only ever returns a value outside production — lets us click through the
 * app in a normal desktop browser tab while building/testing it. */
export function getDevTelegramId() {
  if (process.env.NODE_ENV === "production") return null;
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DEV_ID_KEY);
}

export function setDevTelegramId(id) {
  if (process.env.NODE_ENV === "production") return;
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(DEV_ID_KEY, id);
  else window.localStorage.removeItem(DEV_ID_KEY);
}

export function getAuthHeaders() {
  const webApp = getTelegramWebApp();
  if (webApp?.initData) {
    return { Authorization: `tma ${webApp.initData}` };
  }
  const devId = getDevTelegramId();
  if (devId) {
    return { "x-dev-telegram-id": devId };
  }
  return {};
}

export function initTelegramWebApp() {
  const webApp = getTelegramWebApp();
  if (!webApp) return null;
  webApp.ready();
  webApp.expand();
  try {
    webApp.setHeaderColor?.("secondary_bg_color");
  } catch {
    // not all clients support this
  }
  return webApp;
}

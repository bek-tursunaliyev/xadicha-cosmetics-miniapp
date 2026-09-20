import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegramBot";

/**
 * Telegram calls this with the `X-Telegram-Bot-Api-Secret-Token` header set
 * to whatever we passed as `secret_token` in setWebhook — this is how we
 * confirm a request genuinely came from Telegram and not a random POST.
 */
export async function POST(request) {
  const secret = request.headers.get("x-telegram-bot-api-secret-token");
  if (!process.env.TELEGRAM_WEBHOOK_SECRET || secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const update = await request.json();
  const message = update.message;

  if (message?.text?.startsWith("/start")) {
    const appUrl = process.env.APP_URL;
    await sendTelegramMessage(
      message.chat.id,
      "Xadicha Cosmetics do'koniga xush kelibsiz! 💄\n\nQuyidagi tugma orqali do'konni oching:",
      {
        reply_markup: {
          inline_keyboard: [[{ text: "🛍 Do'konni ochish", web_app: { url: appUrl } }]],
        },
      }
    );
  }

  return NextResponse.json({ ok: true });
}

const TELEGRAM_API = "https://api.telegram.org";

export async function sendTelegramMessage(chatId, text, options = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) return;

  await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      ...options,
    }),
  });
}

function formatSom(amount) {
  return `${Number(amount).toLocaleString("uz-UZ")} so'm`;
}

export async function notifyAdminNewOrder({ orderId, fullName, phone, address, grandTotal, items }) {
  const adminId = process.env.ADMIN_TELEGRAM_ID;
  if (!adminId) return;

  const lines = items.map((item) => `• ${item.product_name} × ${item.quantity} — ${formatSom(item.price * item.quantity)}`);

  const text = [
    `🛒 <b>Yangi buyurtma #${orderId}</b>`,
    ``,
    `👤 ${fullName}`,
    `📞 ${phone}`,
    `📍 ${address}`,
    ``,
    ...lines,
    ``,
    `💰 <b>Jami: ${formatSom(grandTotal)}</b>`,
  ].join("\n");

  await sendTelegramMessage(adminId, text);
}

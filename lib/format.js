export function formatSom(amount) {
  return `${Math.round(Number(amount) || 0).toLocaleString("uz-UZ")} so'm`;
}

export function formatDate(value) {
  return new Date(value).toLocaleString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const ORDER_STATUS_LABELS = {
  new: "Yangi",
  confirmed: "Tasdiqlandi",
  delivering: "Yetkazilmoqda",
  completed: "Yakunlandi",
  cancelled: "Bekor qilindi",
};

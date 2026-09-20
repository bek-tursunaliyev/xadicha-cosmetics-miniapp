"use client";

import { useApp } from "@/components/AppProvider";
import AdminNav from "@/components/AdminNav";
import { IconLock } from "@/components/icons";

export default function AdminLayout({ children }) {
  const { status, isAdmin, errorInfo } = useApp();

  if (status === "loading") {
    return <div className="p-6 text-center text-sm" style={{ color: "var(--muted)" }}>Yuklanmoqda...</div>;
  }

  if (status === "error" || !isAdmin) {
    const notInTelegram = status === "error" && !errorInfo?.hasInitData;
    return (
      <div className="flex flex-col items-center gap-2 px-6 py-24 text-center">
        <IconLock className="text-amber-500" />
        <p className="font-semibold">Ruxsat yo&apos;q</p>
        {notInTelegram ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Bu ilova faqat Telegram bot ichida ochilganda ishlaydi. @xadichacosmetics_bot ni
            oching va menyudagi &quot;Do&apos;kon&quot; tugmasi orqali kiring.
          </p>
        ) : status === "error" ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Tasdiqlashda xatolik yuz berdi ({errorInfo?.status || "?"}). Ilovani yopib, botdan
            qayta oching.
          </p>
        ) : (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Bu bo&apos;lim faqat do&apos;kon administratori uchun.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <AdminNav />
      <div className="px-4 pb-6">{children}</div>
    </div>
  );
}

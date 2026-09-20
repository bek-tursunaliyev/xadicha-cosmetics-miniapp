"use client";

import { useApp } from "@/components/AppProvider";
import AdminNav from "@/components/AdminNav";

export default function AdminLayout({ children }) {
  const { status, isAdmin } = useApp();

  if (status === "loading") {
    return <div className="p-6 text-center text-sm" style={{ color: "var(--muted)" }}>Yuklanmoqda...</div>;
  }

  if (status === "error" || !isAdmin) {
    return (
      <div className="flex flex-col items-center gap-2 px-6 py-24 text-center">
        <span className="text-3xl">🔒</span>
        <p className="font-semibold">Ruxsat yo&apos;q</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Bu bo&apos;lim faqat do&apos;kon administratori uchun.
        </p>
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

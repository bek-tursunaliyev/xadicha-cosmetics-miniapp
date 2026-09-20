"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/products", label: "Mahsulotlar" },
  { href: "/admin/stories", label: "Storylar" },
  { href: "/admin/orders", label: "Buyurtmalar" },
  { href: "/admin/settings", label: "Sozlamalar" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-30 flex gap-1 overflow-x-auto px-4 pb-2 pt-3" style={{ background: "var(--bg)" }}>
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium"
            style={{
              background: active ? "var(--brand)" : "var(--brand-soft)",
              color: active ? "white" : "var(--brand-dark)",
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

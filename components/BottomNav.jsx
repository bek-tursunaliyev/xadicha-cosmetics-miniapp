"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

const TABS = [
  { href: "/", label: "Bosh sahifa", icon: "🏠" },
  { href: "/cart", label: "Savat", icon: "🛒" },
  { href: "/account", label: "Profil", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { totals } = useCart();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex max-w-lg items-stretch">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium"
              style={{ color: active ? "var(--brand)" : "var(--muted)" }}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              {tab.label}
              {tab.href === "/cart" && totals.count > 0 && (
                <span
                  className="absolute right-6 top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                  style={{ background: "var(--brand)" }}
                >
                  {totals.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

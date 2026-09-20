"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { IconHome, IconCart, IconUser } from "./icons";

const TABS = [
  { href: "/", label: "Bosh sahifa", Icon: IconHome },
  { href: "/cart", label: "Savat", Icon: IconCart },
  { href: "/account", label: "Profil", Icon: IconUser },
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
        {TABS.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium"
              style={{ color: active ? "var(--brand)" : "var(--muted)" }}
            >
              <Icon />
              {label}
              {href === "/cart" && totals.count > 0 && (
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

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatSom } from "@/lib/format";

export default function CartPage() {
  const { items, setQuantity, removeItem, totals, hydrated } = useCart();
  const router = useRouter();

  if (hydrated && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
        <span className="text-4xl">🛒</span>
        <p style={{ color: "var(--muted)" }}>Savatingiz bo&apos;sh</p>
        <Link href="/" className="btn btn-primary">
          Xarid qilishni boshlash
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <h1 className="text-lg font-bold">Savat</h1>

      <div className="mt-3 flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.product_id} className="card flex gap-3 p-2.5">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl" style={{ background: "var(--brand-soft)" }}>
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl">💄</div>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium">{item.name}</span>
                <button onClick={() => removeItem(item.product_id)} className="text-sm" style={{ color: "var(--muted)" }}>
                  ✕
                </button>
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>
                {formatSom(item.price)}
              </span>
              <div className="mt-auto flex items-center gap-2">
                <button
                  className="h-7 w-7 rounded-full text-lg font-bold"
                  style={{ background: "var(--brand-soft)", color: "var(--brand-dark)" }}
                  onClick={() => setQuantity(item.product_id, item.quantity - 1)}
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  className="h-7 w-7 rounded-full text-lg font-bold"
                  style={{ background: "var(--brand-soft)", color: "var(--brand-dark)" }}
                  onClick={() => setQuantity(item.product_id, item.quantity + 1)}
                  disabled={item.quantity >= (item.stock ?? 99)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-4 flex flex-col gap-1.5 p-4 text-sm">
        <div className="flex justify-between">
          <span style={{ color: "var(--muted)" }}>Mahsulotlar</span>
          <span>{formatSom(totals.itemsTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--muted)" }}>Yetkazib berish</span>
          <span>{formatSom(totals.deliveryTotal)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t pt-2 text-base font-bold" style={{ borderColor: "var(--border)" }}>
          <span>Jami</span>
          <span style={{ color: "var(--brand-dark)" }}>{formatSom(totals.grandTotal)}</span>
        </div>
      </div>

      <button className="btn btn-primary my-4 w-full" onClick={() => router.push("/checkout")}>
        Buyurtma berish
      </button>
    </div>
  );
}

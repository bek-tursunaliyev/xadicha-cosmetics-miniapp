"use client";

import Link from "next/link";
import { formatSom } from "@/lib/format";
import { useCart } from "./CartProvider";
import { IconBottle } from "./icons";

export default function ProductCard({ product }) {
  const { items, addItem, setQuantity } = useCart();
  const inCart = items.find((item) => item.product_id === product.id);
  const outOfStock = product.stock <= 0;

  return (
    <div className="card flex flex-col overflow-hidden">
      <Link href={`/product/${product.id}`} className="block aspect-square w-full bg-[var(--brand-soft)]">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ color: "var(--brand)" }}>
            <IconBottle size={32} />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <Link href={`/product/${product.id}`} className="line-clamp-2 text-sm font-medium">
          {product.name}
        </Link>
        <div className="mt-auto flex items-baseline justify-between">
          <span className="font-semibold" style={{ color: "var(--brand-dark)" }}>
            {formatSom(product.price)}
          </span>
        </div>
        <span className="text-[11px]" style={{ color: "var(--muted)" }}>
          Yetkazish: {formatSom(product.delivery_price)}
        </span>

        {outOfStock ? (
          <button className="btn btn-outline mt-1 w-full" disabled>
            Tugagan
          </button>
        ) : inCart ? (
          <div className="mt-1 flex items-center justify-between gap-1 rounded-full" style={{ background: "var(--brand-soft)" }}>
            <button
              className="h-8 w-8 shrink-0 text-lg font-bold"
              style={{ color: "var(--brand-dark)" }}
              onClick={() => setQuantity(product.id, inCart.quantity - 1)}
            >
              −
            </button>
            <span className="text-sm font-semibold">{inCart.quantity}</span>
            <button
              className="h-8 w-8 shrink-0 text-lg font-bold"
              style={{ color: "var(--brand-dark)" }}
              onClick={() => setQuantity(product.id, inCart.quantity + 1)}
              disabled={inCart.quantity >= product.stock}
            >
              +
            </button>
          </div>
        ) : (
          <button className="btn btn-primary mt-1 w-full" onClick={() => addItem(product, 1)}>
            Savatga qo&apos;shish
          </button>
        )}
      </div>
    </div>
  );
}

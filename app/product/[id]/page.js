"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import { formatSom } from "@/lib/format";
import { useCart } from "@/components/CartProvider";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { items, addItem, setQuantity } = useCart();

  useEffect(() => {
    apiFetch(`/api/products/${id}`)
      .then((data) => setProduct(data.product))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return <p className="p-6 text-center text-sm" style={{ color: "var(--muted)" }}>{error}</p>;
  }
  if (!product) {
    return <div className="card m-4 aspect-square animate-pulse" />;
  }

  const inCart = items.find((item) => item.product_id === product.id);
  const outOfStock = product.stock <= 0;

  return (
    <div className="pb-6">
      <button onClick={() => router.back()} className="px-4 pt-3 text-sm" style={{ color: "var(--muted)" }}>
        ← Orqaga
      </button>

      <div className="mx-4 mt-2 aspect-square overflow-hidden rounded-2xl" style={{ background: "var(--brand-soft)" }}>
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">💄</div>
        )}
      </div>

      <div className="px-4 pt-4">
        <h1 className="text-lg font-bold">{product.name}</h1>
        <p className="mt-2 text-2xl font-bold" style={{ color: "var(--brand-dark)" }}>
          {formatSom(product.price)}
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Yetkazib berish: {formatSom(product.delivery_price)}
        </p>

        {product.description && <p className="mt-4 text-sm leading-relaxed">{product.description}</p>}

        <div className="mt-6">
          {outOfStock ? (
            <button className="btn btn-outline w-full" disabled>
              Tugagan
            </button>
          ) : inCart ? (
            <div className="flex items-center justify-between gap-3 rounded-full p-1" style={{ background: "var(--brand-soft)" }}>
              <button
                className="h-10 w-10 shrink-0 text-xl font-bold"
                style={{ color: "var(--brand-dark)" }}
                onClick={() => setQuantity(product.id, inCart.quantity - 1)}
              >
                −
              </button>
              <span className="font-semibold">{inCart.quantity} dona savatda</span>
              <button
                className="h-10 w-10 shrink-0 text-xl font-bold"
                style={{ color: "var(--brand-dark)" }}
                onClick={() => setQuantity(product.id, inCart.quantity + 1)}
                disabled={inCart.quantity >= product.stock}
              >
                +
              </button>
            </div>
          ) : (
            <button className="btn btn-primary w-full" onClick={() => addItem(product, 1)}>
              Savatga qo&apos;shish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import { formatSom, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";

export default function OrderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch(`/api/orders/${id}`)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="p-6 text-center text-sm" style={{ color: "var(--muted)" }}>{error}</p>;
  if (!order) return <div className="card m-4 h-40 animate-pulse" />;

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-6">
      {success && (
        <div className="card p-4 text-center" style={{ background: "var(--brand-soft)" }}>
          <p className="font-semibold" style={{ color: "var(--brand-dark)" }}>✅ Buyurtmangiz qabul qilindi!</p>
        </div>
      )}

      <div>
        <h1 className="text-lg font-bold">Buyurtma #{order.id}</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>{formatDate(order.created_at)}</p>
      </div>

      <span
        className="w-fit rounded-full px-3 py-1 text-xs font-semibold"
        style={{ background: "var(--brand-soft)", color: "var(--brand-dark)" }}
      >
        {ORDER_STATUS_LABELS[order.status]}
      </span>

      <div className="card flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between p-3 text-sm" style={{ borderColor: "var(--border)" }}>
            <div>
              <p className="font-medium">{item.product_name}</p>
              <p style={{ color: "var(--muted)" }}>{item.quantity} x {formatSom(item.price)}</p>
            </div>
            <p className="font-semibold">{formatSom(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="card flex flex-col gap-1.5 p-4 text-sm">
        <div className="flex justify-between">
          <span style={{ color: "var(--muted)" }}>Mahsulotlar</span>
          <span>{formatSom(order.items_total)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--muted)" }}>Yetkazib berish</span>
          <span>{formatSom(order.delivery_total)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t pt-2 text-base font-bold" style={{ borderColor: "var(--border)" }}>
          <span>Jami</span>
          <span style={{ color: "var(--brand-dark)" }}>{formatSom(order.grand_total)}</span>
        </div>
      </div>

      <div className="card flex flex-col gap-1 p-4 text-sm">
        <h2 className="mb-1 font-semibold" style={{ color: "var(--muted)" }}>Yetkazib berish ma&apos;lumotlari</h2>
        <p>{order.full_name}</p>
        <p>{order.phone}</p>
        <p>{order.address}</p>
        {order.comment && <p style={{ color: "var(--muted)" }}>Izoh: {order.comment}</p>}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import { formatSom, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";

const STATUSES = ["new", "confirmed", "delivering", "completed", "cancelled"];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(
    () => apiFetch(`/api/orders/${id}`).then((data) => setOrder(data.order)),
    [id]
  );

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (status) => {
    setUpdating(true);
    try {
      await apiFetch(`/api/orders/${id}`, { method: "PATCH", body: { status } });
      await load();
    } finally {
      setUpdating(false);
    }
  };

  if (!order) return <div className="card h-40 animate-pulse" />;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-bold">Buyurtma #{order.id}</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>{formatDate(order.created_at)}</p>
      </div>

      <div>
        <label className="label">Holat</label>
        <select
          className="input"
          value={order.status}
          disabled={updating}
          onChange={(e) => changeStatus(e.target.value)}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

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
        <h2 className="mb-1 font-semibold" style={{ color: "var(--muted)" }}>Mijoz</h2>
        <p>{order.full_name}</p>
        <p>{order.phone}</p>
        <p>{order.address}</p>
        {order.comment && <p style={{ color: "var(--muted)" }}>Izoh: {order.comment}</p>}
      </div>
    </div>
  );
}

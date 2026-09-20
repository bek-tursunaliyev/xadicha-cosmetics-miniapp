"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";
import { formatSom, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    apiFetch("/api/orders").then((data) => setOrders(data.orders));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-bold">Buyurtmalar</h1>

      {orders === null ? (
        <div className="card h-24 animate-pulse" />
      ) : orders.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>Hali buyurtma yo&apos;q</p>
      ) : (
        <div className="flex flex-col gap-2">
          {orders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`} className="card flex items-center justify-between p-3">
              <div>
                <p className="text-sm font-medium">#{order.id} · {order.full_name}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{formatDate(order.created_at)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatSom(order.grand_total)}</p>
                <p className="text-xs" style={{ color: "var(--brand-dark)" }}>{ORDER_STATUS_LABELS[order.status]}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

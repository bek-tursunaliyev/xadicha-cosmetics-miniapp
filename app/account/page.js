"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { apiFetch } from "@/lib/apiClient";
import { formatSom, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";
import { IconCheck, IconSettings } from "@/components/icons";

function ProfileForm({ user, onSaved }) {
  const [form, setForm] = useState({ phone: user.phone || "", address: user.address || "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await apiFetch("/api/me", { method: "PATCH", body: form });
      await onSaved();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="card flex flex-col gap-3 p-4">
      <h2 className="text-sm font-semibold" style={{ color: "var(--muted)" }}>Shaxsiy ma&apos;lumotlar</h2>
      <div>
        <label className="label">Telefon raqam</label>
        <input
          className="input"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+998 90 123 45 67"
        />
      </div>
      <div>
        <label className="label">Manzil</label>
        <textarea
          className="input"
          rows={2}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>
      <button className="btn btn-primary" disabled={saving}>
        {saving ? "Saqlanmoqda..." : saved ? (<><IconCheck size={16} /> Saqlandi</>) : "Saqlash"}
      </button>
    </form>
  );
}

export default function AccountPage() {
  const { user, isAdmin, refreshUser } = useApp();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    apiFetch("/api/orders")
      .then((data) => setOrders(data.orders))
      .catch(() => setOrders([]));
  }, []);

  if (!user) return <div className="p-6" />;

  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || "Mehmon";

  return (
    <div className="flex flex-col gap-6 px-4 pt-4 pb-6">
      <div>
        <h1 className="text-lg font-bold">Profil</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>{displayName}{user.username ? ` · @${user.username}` : ""}</p>
      </div>

      {isAdmin && (
        <Link href="/admin" className="btn btn-secondary w-full">
          <IconSettings size={16} /> Admin panelga o&apos;tish
        </Link>
      )}

      <ProfileForm user={user} onSaved={refreshUser} />

      <div>
        <h2 className="mb-2 text-sm font-semibold" style={{ color: "var(--muted)" }}>Buyurtmalar tarixi</h2>
        {orders === null ? (
          <div className="card h-16 animate-pulse" />
        ) : orders.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>Buyurtmalar yo&apos;q</p>
        ) : (
          <div className="flex flex-col gap-2">
            {orders.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="card flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium">Buyurtma #{order.id}</p>
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
    </div>
  );
}

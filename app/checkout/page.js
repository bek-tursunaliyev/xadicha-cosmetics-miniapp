"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useApp } from "@/components/AppProvider";
import { apiFetch } from "@/lib/apiClient";
import { formatSom } from "@/lib/format";

function CheckoutForm({ user, items, totals, clear }) {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    phone: user?.phone || "",
    address: user?.address || "",
    comment: "",
  });
  const [coords, setCoords] = useState(
    user?.latitude && user?.longitude ? { lat: user.latitude, lng: user.longitude } : null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const shareLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.full_name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setSubmitting(true);
    try {
      const { order_id } = await apiFetch("/api/orders", {
        method: "POST",
        body: {
          items: items.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
          full_name: form.full_name,
          phone: form.phone,
          address: form.address,
          comment: form.comment,
          latitude: coords?.lat,
          longitude: coords?.lng,
        },
      });
      clear();
      router.replace(`/account/orders/${order_id}?success=1`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pt-4 pb-6">
      <h1 className="text-lg font-bold">Buyurtmani rasmiylashtirish</h1>

      <div>
        <label className="label">Ism familiya *</label>
        <input
          className="input"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="Xadicha Aliyeva"
        />
      </div>

      <div>
        <label className="label">Telefon raqam *</label>
        <input
          className="input"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+998 90 123 45 67"
          type="tel"
        />
      </div>

      <div>
        <label className="label">Manzil *</label>
        <textarea
          className="input"
          rows={2}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Shahar, tuman, ko'cha, uy"
        />
        <button type="button" onClick={shareLocation} className="btn btn-outline mt-2 w-full text-sm">
          📍 {coords ? "Joylashuv biriktirildi" : "Joylashuvni yuborish (ixtiyoriy)"}
        </button>
      </div>

      <div>
        <label className="label">Izoh (ixtiyoriy)</label>
        <textarea
          className="input"
          rows={2}
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
      </div>

      <div className="card flex flex-col gap-1.5 p-4 text-sm">
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

      {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}

      <button className="btn btn-primary w-full" disabled={submitting}>
        {submitting ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, totals, clear, hydrated } = useCart();
  const { status, user } = useApp();
  const router = useRouter();
  const checkedEmptyRef = useRef(false);

  // Only guards direct navigation to /checkout with nothing in the cart —
  // must run once, not on every items change, or clearing the cart after a
  // successful order races this redirect against the order-confirmation one.
  useEffect(() => {
    if (hydrated && !checkedEmptyRef.current) {
      checkedEmptyRef.current = true;
      if (items.length === 0) router.replace("/cart");
    }
  }, [hydrated, items.length, router]);

  if (status === "loading" || !hydrated) {
    return <div className="card m-4 h-64 animate-pulse" />;
  }

  return <CheckoutForm user={user} items={items} totals={totals} clear={clear} />;
}

"use client";

import { useState } from "react";

const EMPTY = { name: "", description: "", image_url: "", price: "", delivery_price: "", stock: "", keywords: "" };

export default function ProductForm({ initial, onSubmit, onCancel, submitLabel = "Saqlash" }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === "") {
      setError("Nomi va narxi majburiy");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSubmit({
        name: form.name,
        description: form.description || null,
        image_url: form.image_url || null,
        price: Number(form.price),
        delivery_price: Number(form.delivery_price) || 0,
        stock: Number(form.stock) || 0,
        keywords: form.keywords || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3 p-4">
      <div>
        <label className="label">Nomi *</label>
        <input className="input" value={form.name} onChange={update("name")} placeholder="Nam kremi" />
      </div>
      <div>
        <label className="label">Rasm URL</label>
        <input className="input" value={form.image_url || ""} onChange={update("image_url")} placeholder="https://..." />
      </div>
      <div>
        <label className="label">Tavsif</label>
        <textarea className="input" rows={2} value={form.description || ""} onChange={update("description")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Narx (so&apos;m) *</label>
          <input className="input" type="number" min="0" value={form.price} onChange={update("price")} />
        </div>
        <div>
          <label className="label">Yetkazish narxi</label>
          <input className="input" type="number" min="0" value={form.delivery_price} onChange={update("delivery_price")} />
        </div>
      </div>
      <div>
        <label className="label">Ombordagi soni</label>
        <input className="input" type="number" min="0" value={form.stock} onChange={update("stock")} />
      </div>
      <div>
        <label className="label">Qidiruv so&apos;zlari (bo&apos;sh joy bilan ajrating)</label>
        <input className="input" value={form.keywords || ""} onChange={update("keywords")} placeholder="krem yuz quruq-teri namlantiruvchi" />
      </div>

      {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}

      <div className="flex gap-2">
        <button className="btn btn-primary flex-1" disabled={saving}>
          {saving ? "Saqlanmoqda..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-outline">
            Bekor qilish
          </button>
        )}
      </div>
    </form>
  );
}

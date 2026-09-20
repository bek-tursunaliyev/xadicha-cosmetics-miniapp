"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { IconCheck } from "@/components/icons";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({ address: "", latitude: "", longitude: "", map_url: "" });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/api/settings").then((data) => {
      const s = data.settings || {};
      setForm({
        address: s.address || "",
        latitude: s.latitude ?? "",
        longitude: s.longitude ?? "",
        map_url: s.map_url || "",
      });
      setLoaded(true);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await apiFetch("/api/settings", {
        method: "PATCH",
        body: {
          address: form.address,
          latitude: form.latitude === "" ? null : Number(form.latitude),
          longitude: form.longitude === "" ? null : Number(form.longitude),
          map_url: form.map_url,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <div className="card h-40 animate-pulse" />;

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3 p-4">
      <h1 className="text-lg font-bold">Do&apos;kon sozlamalari</h1>

      <div>
        <label className="label">Manzil</label>
        <textarea className="input" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Latitude</label>
          <input className="input" type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
        </div>
        <div>
          <label className="label">Longitude</label>
          <input className="input" type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="label">Xarita URL</label>
        <input className="input" value={form.map_url} onChange={(e) => setForm({ ...form, map_url: e.target.value })} placeholder="https://maps.google.com/..." />
      </div>

      <button className="btn btn-primary" disabled={saving}>
        {saving ? "Saqlanmoqda..." : saved ? (<><IconCheck size={16} /> Saqlandi</>) : "Saqlash"}
      </button>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";

export default function AdminStoriesPage() {
  const [stories, setStories] = useState(null);
  const [form, setForm] = useState({ image_url: "", title: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const load = () => apiFetch("/api/stories").then((data) => setStories(data.stories));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.image_url.trim()) {
      setError("Rasm URL kiritish shart");
      return;
    }
    setError(null);
    setCreating(true);
    try {
      await apiFetch("/api/stories", { method: "POST", body: form });
      setForm({ image_url: "", title: "" });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (story) => {
    await apiFetch(`/api/stories/${story.id}`, { method: "PATCH", body: { is_active: !story.is_active } });
    await load();
  };

  const remove = async (id) => {
    if (!confirm("Storyni o'chirishni tasdiqlaysizmi?")) return;
    await apiFetch(`/api/stories/${id}`, { method: "DELETE" });
    await load();
  };

  const move = async (index, direction) => {
    const next = [...stories];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setStories(next);
    await apiFetch("/api/stories/reorder", { method: "POST", body: { order: next.map((s) => s.id) } });
  };

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-bold">Storylar</h1>

      <form onSubmit={handleCreate} className="card flex flex-col gap-3 p-4">
        <div>
          <label className="label">Rasm URL *</label>
          <input className="input" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
        </div>
        <div>
          <label className="label">Sarlavha (ixtiyoriy)</label>
          <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
        <button className="btn btn-primary" disabled={creating}>
          {creating ? "Qo'shilmoqda..." : "+ Story qo'shish"}
        </button>
      </form>

      {stories === null ? (
        <div className="card h-16 animate-pulse" />
      ) : stories.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>Hali story yo&apos;q</p>
      ) : (
        <div className="flex flex-col gap-2">
          {stories.map((story, index) => (
            <div key={story.id} className="card flex items-center gap-3 p-2.5">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full" style={{ background: "var(--brand-soft)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.image_url} alt={story.title || "story"} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{story.title || `Story #${story.id}`}</p>
                <p className="text-xs" style={{ color: story.is_active ? "var(--success)" : "var(--muted)" }}>
                  {story.is_active ? "Faol" : "Nofaol"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button className="btn btn-outline px-2 py-1 text-xs" onClick={() => move(index, -1)} disabled={index === 0}>↑</button>
                <button className="btn btn-outline px-2 py-1 text-xs" onClick={() => move(index, 1)} disabled={index === stories.length - 1}>↓</button>
                <button className="btn btn-outline px-2 py-1 text-xs" onClick={() => toggleActive(story)}>
                  {story.is_active ? "Yashirish" : "Ko'rsatish"}
                </button>
                <button className="btn btn-outline px-2 py-1 text-xs" style={{ color: "var(--danger)" }} onClick={() => remove(story.id)}>
                  O&apos;chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import StoriesRow from "@/components/StoriesRow";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    apiFetch("/api/stories")
      .then((data) => setStories(data.stories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = debouncedQuery.trim();
    apiFetch(`/api/products${q ? `?q=${encodeURIComponent(q)}` : ""}`)
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <div>
      <header className="sticky top-0 z-30 pb-2 pt-3" style={{ background: "var(--bg)" }}>
        <h1 className="px-4 text-xl font-bold" style={{ color: "var(--brand-dark)" }}>
          Xadicha Cosmetics
        </h1>

        <StoriesRow stories={stories} />

        <div className="px-4 pt-1">
          <input
            className="input"
            placeholder="Qidirish: krem, yuz, quruq teri..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="px-4 pt-3">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="py-12 text-center text-sm" style={{ color: "var(--muted)" }}>
            Hech narsa topilmadi
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { formatSom } from "@/lib/format";
import ProductForm from "@/components/admin/ProductForm";
import { IconBottle } from "@/components/icons";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const load = () => apiFetch("/api/products").then((data) => setProducts(data.products));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (values) => {
    await apiFetch("/api/products", { method: "POST", body: values });
    setShowCreate(false);
    await load();
  };

  const handleUpdate = async (id, values) => {
    await apiFetch(`/api/products/${id}`, { method: "PATCH", body: values });
    setEditingId(null);
    await load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    await apiFetch(`/api/products/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Mahsulotlar</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate((v) => !v)}>
          {showCreate ? "Yopish" : "+ Qo'shish"}
        </button>
      </div>

      {showCreate && <ProductForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} submitLabel="Qo'shish" />}

      {products === null ? (
        <div className="card h-24 animate-pulse" />
      ) : products.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>Hali mahsulot yo&apos;q</p>
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((product) =>
            editingId === product.id ? (
              <ProductForm
                key={product.id}
                initial={{
                  name: product.name,
                  description: product.description || "",
                  image_url: product.image_url || "",
                  price: product.price,
                  delivery_price: product.delivery_price,
                  stock: product.stock,
                  keywords: product.keywords || "",
                }}
                onSubmit={(values) => handleUpdate(product.id, values)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div key={product.id} className="card flex items-center gap-3 p-2.5">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl" style={{ background: "var(--brand-soft)" }}>
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center" style={{ color: "var(--brand)" }}>
                      <IconBottle size={22} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>{formatSom(product.price)}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    Yetkazish: {formatSom(product.delivery_price)} · Ombor: {product.stock}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button className="btn btn-outline px-3 py-1 text-xs" onClick={() => setEditingId(product.id)}>
                    Tahrirlash
                  </button>
                  <button className="btn btn-outline px-3 py-1 text-xs" style={{ color: "var(--danger)" }} onClick={() => handleDelete(product.id)}>
                    O&apos;chirish
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth, requireAdmin, jsonError } from "@/lib/apiHelpers";

export async function GET(request, { params }) {
  const { error } = await requireAuth(request);
  if (error) return error;

  const { id } = await params;
  const rows = await sql`SELECT * FROM products WHERE id = ${id}`;
  if (!rows[0]) return jsonError("Not found", 404);

  return NextResponse.json({ product: rows[0] });
}

export async function PATCH(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const existing = await sql`SELECT * FROM products WHERE id = ${id}`;
  if (!existing[0]) return jsonError("Not found", 404);
  const current = existing[0];

  const next = {
    name: body.name ?? current.name,
    description: body.description ?? current.description,
    image_url: body.image_url ?? current.image_url,
    price: body.price ?? current.price,
    delivery_price: body.delivery_price ?? current.delivery_price,
    stock: body.stock ?? current.stock,
    keywords: body.keywords ?? current.keywords,
  };

  const rows = await sql`
    UPDATE products SET
      name = ${next.name},
      description = ${next.description},
      image_url = ${next.image_url},
      price = ${next.price},
      delivery_price = ${next.delivery_price},
      stock = ${next.stock},
      keywords = ${next.keywords},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;

  return NextResponse.json({ product: rows[0] });
}

export async function DELETE(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  await sql`DELETE FROM products WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}

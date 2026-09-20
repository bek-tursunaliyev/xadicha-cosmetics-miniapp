import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth, requireAdmin, jsonError } from "@/lib/apiHelpers";

export async function GET(request) {
  const { error } = await requireAuth(request);
  if (error) return error;

  const q = request.nextUrl.searchParams.get("q")?.trim();

  let rows;
  if (q) {
    rows = await sql`
      SELECT * FROM products
      WHERE name ILIKE ${"%" + q + "%"} OR keywords ILIKE ${"%" + q + "%"}
      ORDER BY created_at DESC
    `;
  } else {
    rows = await sql`SELECT * FROM products ORDER BY created_at DESC`;
  }

  return NextResponse.json({ products: rows });
}

export async function POST(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json();
  const { name, description, image_url, price, delivery_price, stock, keywords } = body;

  if (!name || price == null) {
    return jsonError("name and price are required");
  }

  const rows = await sql`
    INSERT INTO products (name, description, image_url, price, delivery_price, stock, keywords)
    VALUES (
      ${name},
      ${description || null},
      ${image_url || null},
      ${price},
      ${delivery_price || 0},
      ${stock ?? 0},
      ${keywords || ""}
    )
    RETURNING *
  `;

  return NextResponse.json({ product: rows[0] }, { status: 201 });
}

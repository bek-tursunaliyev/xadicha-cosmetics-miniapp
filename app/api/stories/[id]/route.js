import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin, jsonError } from "@/lib/apiHelpers";

export async function PATCH(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const existing = await sql`SELECT * FROM stories WHERE id = ${id}`;
  if (!existing[0]) return jsonError("Not found", 404);
  const current = existing[0];

  const next = {
    image_url: body.image_url ?? current.image_url,
    title: body.title ?? current.title,
    link_product_id: body.link_product_id ?? current.link_product_id,
    is_active: body.is_active ?? current.is_active,
    sort_order: body.sort_order ?? current.sort_order,
  };

  const rows = await sql`
    UPDATE stories SET
      image_url = ${next.image_url},
      title = ${next.title},
      link_product_id = ${next.link_product_id},
      is_active = ${next.is_active},
      sort_order = ${next.sort_order}
    WHERE id = ${id}
    RETURNING *
  `;

  return NextResponse.json({ story: rows[0] });
}

export async function DELETE(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  await sql`DELETE FROM stories WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}

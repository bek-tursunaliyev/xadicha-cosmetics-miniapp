import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth, requireAdmin, jsonError } from "@/lib/apiHelpers";

export async function GET(request) {
  const { auth, error } = await requireAuth(request);
  if (error) return error;

  const rows = auth.isAdmin
    ? await sql`SELECT * FROM stories ORDER BY sort_order ASC, created_at DESC`
    : await sql`
        SELECT * FROM stories
        WHERE is_active = true
        ORDER BY sort_order ASC, created_at DESC
      `;

  return NextResponse.json({ stories: rows });
}

export async function POST(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json();
  const { image_url, title, link_product_id } = body;
  if (!image_url) return jsonError("image_url is required");

  const maxRow = await sql`SELECT COALESCE(MAX(sort_order), -1) AS max FROM stories`;
  const nextOrder = Number(maxRow[0].max) + 1;

  const rows = await sql`
    INSERT INTO stories (image_url, title, link_product_id, sort_order)
    VALUES (${image_url}, ${title || null}, ${link_product_id || null}, ${nextOrder})
    RETURNING *
  `;

  return NextResponse.json({ story: rows[0] }, { status: 201 });
}

import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/apiHelpers";

export async function GET(request) {
  const { error } = await requireAuth(request);
  if (error) return error;

  const rows = await sql`SELECT * FROM shop_settings WHERE id = 1`;
  return NextResponse.json({ settings: rows[0] });
}

export async function PATCH(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json();
  const current = (await sql`SELECT * FROM shop_settings WHERE id = 1`)[0];

  const next = {
    address: body.address ?? current.address,
    latitude: body.latitude ?? current.latitude,
    longitude: body.longitude ?? current.longitude,
    map_url: body.map_url ?? current.map_url,
  };

  const rows = await sql`
    UPDATE shop_settings SET
      address = ${next.address},
      latitude = ${next.latitude},
      longitude = ${next.longitude},
      map_url = ${next.map_url},
      updated_at = now()
    WHERE id = 1
    RETURNING *
  `;

  return NextResponse.json({ settings: rows[0] });
}

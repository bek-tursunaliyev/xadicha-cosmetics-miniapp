import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/apiHelpers";

export async function GET(request) {
  const { auth, error } = await requireAuth(request);
  if (error) return error;

  return NextResponse.json({ user: auth.dbUser, isAdmin: auth.isAdmin });
}

export async function PATCH(request) {
  const { auth, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const current = auth.dbUser;
  const next = {
    phone: body.phone ?? current.phone,
    address: body.address ?? current.address,
    latitude: body.latitude ?? current.latitude,
    longitude: body.longitude ?? current.longitude,
  };

  const rows = await sql`
    UPDATE users SET
      phone = ${next.phone},
      address = ${next.address},
      latitude = ${next.latitude},
      longitude = ${next.longitude},
      updated_at = now()
    WHERE id = ${current.id}
    RETURNING *
  `;

  return NextResponse.json({ user: rows[0] });
}

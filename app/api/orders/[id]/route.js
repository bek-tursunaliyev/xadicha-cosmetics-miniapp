import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth, requireAdmin, jsonError } from "@/lib/apiHelpers";
import { getOrderWithItems } from "@/lib/orders";

const VALID_STATUSES = ["new", "confirmed", "delivering", "completed", "cancelled"];

export async function GET(request, { params }) {
  const { auth, error } = await requireAuth(request);
  if (error) return error;

  const { id } = await params;
  const order = await getOrderWithItems(id);
  if (!order) return jsonError("Not found", 404);
  if (!auth.isAdmin && order.user_id !== auth.dbUser.id) {
    return jsonError("Forbidden", 403);
  }

  return NextResponse.json({ order });
}

export async function PATCH(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const { status } = await request.json();
  if (!VALID_STATUSES.includes(status)) return jsonError("Invalid status");

  const rows = await sql`
    UPDATE orders SET status = ${status}, updated_at = now() WHERE id = ${id} RETURNING *
  `;
  if (!rows[0]) return jsonError("Not found", 404);

  return NextResponse.json({ order: rows[0] });
}

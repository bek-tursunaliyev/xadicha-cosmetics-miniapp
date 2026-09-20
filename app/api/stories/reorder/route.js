import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin, jsonError } from "@/lib/apiHelpers";

/** body: { order: [storyId, storyId, ...] } in the new display order */
export async function POST(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { order } = await request.json();
  if (!Array.isArray(order) || order.length === 0) {
    return jsonError("order must be a non-empty array of story ids");
  }

  await Promise.all(
    order.map((id, index) => sql`UPDATE stories SET sort_order = ${index} WHERE id = ${id}`)
  );

  return NextResponse.json({ ok: true });
}

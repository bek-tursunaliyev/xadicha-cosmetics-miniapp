import { NextResponse } from "next/server";
import { authenticate } from "./auth";

export function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Returns { auth } on success, or { error: Response } to return immediately. */
export async function requireAuth(request) {
  const auth = await authenticate(request);
  if (!auth) return { error: jsonError("Unauthorized", 401) };
  return { auth };
}

export async function requireAdmin(request) {
  const { auth, error } = await requireAuth(request);
  if (error) return { error };
  if (!auth.isAdmin) return { error: jsonError("Forbidden", 403) };
  return { auth };
}

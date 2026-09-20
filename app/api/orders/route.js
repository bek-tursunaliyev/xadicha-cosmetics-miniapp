import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth, jsonError } from "@/lib/apiHelpers";
import { createOrder } from "@/lib/orders";
import { notifyAdminNewOrder } from "@/lib/telegramBot";

export async function GET(request) {
  const { auth, error } = await requireAuth(request);
  if (error) return error;

  const rows = auth.isAdmin
    ? await sql`SELECT * FROM orders ORDER BY created_at DESC`
    : await sql`
        SELECT * FROM orders WHERE user_id = ${auth.dbUser.id} ORDER BY created_at DESC
      `;

  return NextResponse.json({ orders: rows });
}

export async function POST(request) {
  const { auth, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { items, full_name, phone, address, latitude, longitude, comment } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return jsonError("items is required");
  }
  if (!full_name || !phone || !address) {
    return jsonError("full_name, phone and address are required");
  }

  const productIds = items.map((item) => item.product_id);
  const products = await sql`SELECT * FROM products WHERE id = ANY(${productIds})`;
  const productsById = new Map(products.map((product) => [String(product.id), product]));

  const orderItems = [];
  for (const item of items) {
    const product = productsById.get(String(item.product_id));
    const quantity = Number(item.quantity) || 0;
    if (!product) return jsonError(`Product ${item.product_id} not found`, 400);
    if (quantity <= 0) return jsonError("quantity must be positive");
    if (quantity > product.stock) {
      return jsonError(`"${product.name}" uchun yetarli mahsulot yo'q (qolgan: ${product.stock})`, 409);
    }
    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      quantity,
      price: Number(product.price),
      delivery_price: Number(product.delivery_price),
    });
  }

  const itemsTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryTotal = orderItems.reduce((sum, item) => sum + item.delivery_price, 0);
  const grandTotal = itemsTotal + deliveryTotal;

  let orderId;
  try {
    orderId = await createOrder({
      userId: auth.dbUser.id,
      items: orderItems,
      fullName: full_name,
      phone,
      address,
      latitude,
      longitude,
      comment,
      itemsTotal,
      deliveryTotal,
      grandTotal,
    });
  } catch (err) {
    console.error("createOrder failed", err);
    return jsonError("Buyurtmani saqlab bo'lmadi, birozdan so'ng qayta urinib ko'ring", 500);
  }

  notifyAdminNewOrder({ orderId, fullName: full_name, phone, address, grandTotal, items: orderItems }).catch(
    (err) => console.error("notifyAdminNewOrder failed", err)
  );

  return NextResponse.json({ order_id: orderId }, { status: 201 });
}

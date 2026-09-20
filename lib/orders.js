import { sql } from "./db";

/**
 * Creates an order and its line items atomically in a single statement
 * (Postgres CTEs run inside one implicit transaction), snapshotting product
 * name/price/delivery price at order time and decrementing stock.
 * Relies on the `products.stock >= 0` CHECK constraint as the final race-safe
 * guard against overselling under concurrent checkouts.
 */
export async function createOrder({ userId, items, fullName, phone, address, latitude, longitude, comment, itemsTotal, deliveryTotal, grandTotal }) {
  const itemsJson = JSON.stringify(
    items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      delivery_price: item.delivery_price,
    }))
  );

  const rows = await sql`
    WITH new_order AS (
      INSERT INTO orders (
        user_id, items_total, delivery_total, grand_total,
        full_name, phone, address, latitude, longitude, comment
      )
      VALUES (
        ${userId}, ${itemsTotal}, ${deliveryTotal}, ${grandTotal},
        ${fullName}, ${phone}, ${address}, ${latitude ?? null}, ${longitude ?? null}, ${comment || null}
      )
      RETURNING id
    ),
    parsed_items AS (
      SELECT
        (x->>'product_id')::bigint AS product_id,
        x->>'product_name' AS product_name,
        (x->>'quantity')::int AS quantity,
        (x->>'price')::numeric AS price,
        (x->>'delivery_price')::numeric AS delivery_price
      FROM jsonb_array_elements(${itemsJson}::jsonb) AS x
    ),
    inserted_items AS (
      INSERT INTO order_items (order_id, product_id, product_name, quantity, price, delivery_price)
      SELECT new_order.id, p.product_id, p.product_name, p.quantity, p.price, p.delivery_price
      FROM new_order, parsed_items p
      RETURNING product_id, quantity
    ),
    stock_updates AS (
      UPDATE products p
      SET stock = p.stock - ii.quantity
      FROM inserted_items ii
      WHERE p.id = ii.product_id
      RETURNING p.id
    )
    SELECT new_order.id AS order_id FROM new_order
  `;

  return rows[0].order_id;
}

export async function getOrderWithItems(orderId) {
  const orderRows = await sql`SELECT * FROM orders WHERE id = ${orderId}`;
  const order = orderRows[0];
  if (!order) return null;

  const items = await sql`
    SELECT * FROM order_items WHERE order_id = ${orderId} ORDER BY id ASC
  `;

  return { ...order, items };
}

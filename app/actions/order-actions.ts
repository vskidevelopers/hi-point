/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/actions/order-actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitOrder(formData: FormData) {
  const supabase = await createClient()

  // Extract and clean form data
  const customerName = formData.get("customer_name") as string
  const customerPhone = (formData.get("customer_phone") as string).replace(
    /\s+/g,
    ""
  )
  const customerEmail = (formData.get("customer_email") as string) || null
  const fulfillmentType = formData.get("fulfillment_type") as
    "pickup" | "delivery"
  const deliveryLocation = (formData.get("delivery_location") as string) || null
  const mpesaCode = (formData.get("mpesa_code") as string).trim().toUpperCase()
  const cartItemsJson = formData.get("cart_items") as string

  if (!cartItemsJson) {
    return { success: false, error: "Your cart is empty." }
  }

  const cartItems = JSON.parse(cartItemsJson)

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  )

  // 1. Insert the main Order record
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      fulfillment_type: fulfillmentType,
      delivery_location: deliveryLocation,
      subtotal: subtotal,
      delivery_fee: 0, // Admin will update this later if delivery is chosen
      total_amount: subtotal, // Total = Subtotal + Delivery Fee (updated by admin)
      mpesa_transaction_code: mpesaCode,
      payment_status: "pending",
      order_status: "pending_payment",
    })
    .select("id, order_number")
    .single()

  if (orderError || !order) {
    console.error("Order creation error:", orderError)
    return {
      success: false,
      error: "Failed to create order. Please try again.",
    }
  }

  // 2. Insert the Order Items
  const orderItemsData = cartItems.map((item: any) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
  }))

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsData)

  if (itemsError) {
    console.error("Order items error:", itemsError)
    // Note: In a production app, we'd use a database transaction to rollback the order if items fail.
  }

  // Revalidate admin path so the new order shows up immediately
  revalidatePath("/admin/orders")

  return { success: true, orderNumber: order.order_number }
}

// src/app/actions/admin-order-actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateOrderStatus(
  orderId: string,
  paymentStatus: string,
  orderStatus: string,
  deliveryFee: number
) {
  const supabase = await createClient()

  // Fetch current subtotal to calculate the new total
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("subtotal")
    .eq("id", orderId)
    .single()

  if (fetchError || !order) {
    return { success: false, error: "Order not found." }
  }

  const newTotal = order.subtotal + deliveryFee

  // Update the order
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      order_status: orderStatus,
      delivery_fee: deliveryFee,
      total_amount: newTotal,
    })
    .eq("id", orderId)

  if (updateError) {
    console.error("Update error:", updateError)
    return { success: false, error: "Failed to update order." }
  }

  // Revalidate paths so the UI updates immediately
  revalidatePath("/admin/orders")
  revalidatePath("/admin/dashboard")
  revalidatePath("/track") // So the customer sees the update on the tracking page

  return { success: true }
}

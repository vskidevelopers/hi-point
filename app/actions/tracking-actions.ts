/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/actions/tracking-actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"

export async function trackReference(
  referenceNumber: string,
  phoneNumber: string
) {
  const supabase = await createClient()

  // Clean inputs
  const cleanPhone = phoneNumber.replace(/\s+/g, "")
  const cleanRef = referenceNumber.trim().toUpperCase()

  // 1. Try to find an Order
  const { data: orderData } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", cleanRef)
    .eq("customer_phone", cleanPhone)
    .single()

  if (orderData) {
    return { success: true, type: "order", data: orderData }
  }

  // 2. Try to find a Repair Ticket
  const { data: ticketData } = await supabase
    .from("service_tickets")
    .select("*, ticket_updates(*)")
    .eq("ticket_number", cleanRef)
    .eq("customer_phone", cleanPhone)
    .single()

  if (ticketData) {
    // Sort the timeline updates chronologically
    ticketData.ticket_updates.sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    return { success: true, type: "ticket", data: ticketData }
  }

  // 3. No match found
  return {
    success: false,
    error:
      "No matching record found. Please check your reference number and phone number.",
  }
}

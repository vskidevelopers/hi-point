// src/app/actions/admin-ticket-actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateTicketDetails(
  ticketId: string,
  currentStatus: string,
  newStatus: string,
  consultationFee: number,
  repairQuote: number,
  adminNotes: string
) {
  const supabase = await createClient()

  // 1. Update the main ticket record
  const { error: updateError } = await supabase
    .from("service_tickets")
    .update({
      status: newStatus,
      consultation_fee: consultationFee,
      repair_quote: repairQuote,
    })
    .eq("id", ticketId)

  if (updateError) {
    console.error("Ticket update error:", updateError)
    return { success: false, error: "Failed to update ticket." }
  }

  // 2. Log the status change and notes in the timeline
  const { error: logError } = await supabase.from("ticket_updates").insert({
    ticket_id: ticketId,
    old_status: currentStatus,
    new_status: newStatus,
    admin_notes: adminNotes || null,
  })

  if (logError) {
    console.error("Ticket log error:", logError)
  }

  // Revalidate paths so the UI updates immediately everywhere
  revalidatePath("/admin/tickets")
  revalidatePath("/admin/dashboard")
  revalidatePath("/track")

  return { success: true }
}

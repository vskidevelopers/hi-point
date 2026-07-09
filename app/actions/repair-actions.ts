// src/app/actions/repair-actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitRepairRequest(formData: FormData) {
  const supabase = await createClient()

  // Basic cleanup for phone number (remove spaces)
  const rawPhone = formData.get("customer_phone") as string
  const cleanPhone = rawPhone.replace(/\s+/g, "")

  const { data, error } = await supabase
    .from("service_tickets")
    .insert({
      customer_name: formData.get("customer_name") as string,
      customer_phone: cleanPhone,
      customer_email: (formData.get("customer_email") as string) || null,
      device_brand: formData.get("device_brand") as string,
      device_model: formData.get("device_model") as string,
      issue_description: formData.get("issue_description") as string,
      status: "pending_assessment",
    })
    .select("ticket_number")
    .single()

  if (error) {
    console.error("Repair submission error:", error)
    return {
      success: false,
      error: "Failed to submit repair request. Please try again.",
    }
  }

  // Revalidate the admin path so the new ticket shows up immediately if the admin is viewing it
  revalidatePath("/admin/tickets")

  return { success: true, ticketNumber: data.ticket_number }
}

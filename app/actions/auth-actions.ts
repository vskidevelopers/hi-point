// src/app/actions/auth-actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: "Invalid email or password." }
  }

  const headersList = await headers()
  const referer = headersList.get("referer")
  const redirectUrl = referer
    ? new URL(referer).searchParams.get("redirect")
    : null

  redirect(redirectUrl || "/admin/dashboard")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

// src/app/actions/admin-product-actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Helper to generate a URL-friendly slug
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const slug = (formData.get("slug") as string).trim() || slugify(name)
  const description = (formData.get("description") as string) || null
  const basePrice = parseFloat(formData.get("base_price") as string) || 0
  const imageUrl = (formData.get("image_url") as string) || null
  const categoryId = (formData.get("category_id") as string) || null
  const isInquiryOnly = formData.get("is_inquiry_only") === "on"

  const { error } = await supabase.from("products").insert({
    name,
    slug,
    description,
    base_price: basePrice,
    image_url: imageUrl,
    category_id: categoryId === "none" ? null : categoryId,
    is_inquiry_only: isInquiryOnly,
  })

  if (error) {
    console.error("Create product error:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/products")
  revalidatePath("/products")
  return { success: true }
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const slug = (formData.get("slug") as string).trim() || slugify(name)
  const description = (formData.get("description") as string) || null
  const basePrice = parseFloat(formData.get("base_price") as string) || 0
  const imageUrl = (formData.get("image_url") as string) || null
  const categoryId = (formData.get("category_id") as string) || null
  const isInquiryOnly = formData.get("is_inquiry_only") === "on"

  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      description,
      base_price: basePrice,
      image_url: imageUrl,
      category_id: categoryId === "none" ? null : categoryId,
      is_inquiry_only: isInquiryOnly,
    })
    .eq("id", productId)

  if (error) {
    console.error("Update product error:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/products")
  revalidatePath("/products")
  return { success: true }
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("products").delete().eq("id", productId)

  if (error) {
    console.error("Delete product error:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/products")
  revalidatePath("/products")
  return { success: true }
}

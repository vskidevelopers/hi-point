/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/actions/upload-actions.ts
"use server"

import cloudinary from "@/lib/cloudinary"

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File | null

  if (!file) {
    return { success: false, error: "No file provided." }
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "File must be an image." }
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "File size must be under 5MB." }
  }

  try {
    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary as a Promise
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "high-point-tech/products",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result as any)
            }
          )
          .end(buffer)
      }
    )

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error("Upload error:", error)
    return { success: false, error: "Failed to upload image." }
  }
}

export async function deleteImage(publicId: string) {
  if (!publicId) return { success: true }

  try {
    await cloudinary.uploader.destroy(publicId)
    return { success: true }
  } catch (error) {
    console.error("Delete error:", error)
    return { success: false, error: "Failed to delete image." }
  }
}

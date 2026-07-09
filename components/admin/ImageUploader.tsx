// src/components/admin/ImageUploader.tsx
'use client'

import { useState, useRef, DragEvent } from 'react'
import { uploadImage, deleteImage } from '@/app/actions/upload-actions'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
    value?: string | null          // Current image URL (for edit mode)
    onChange: (url: string | null) => void
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(value || null)
    const [error, setError] = useState<string | null>(null)
    const [isDragActive, setIsDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    async function handleFile(file: File) {
        setError(null)

        // Client-side validation
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file.')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be under 5MB.')
            return
        }

        // Show local preview immediately
        const localPreview = URL.createObjectURL(file)
        setPreview(localPreview)
        setIsUploading(true)

        // Upload to Cloudinary
        const formData = new FormData()
        formData.append('file', file)
        const result = await uploadImage(formData)

        setIsUploading(false)

        if (result.success && result.url) {
            onChange(result.url)
            setPreview(result.url) // Replace local preview with final Cloudinary URL
        } else {
            setError(result.error || 'Upload failed.')
            setPreview(value || null) // Revert to previous
        }
    }

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setIsDragActive(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    async function handleRemove() {
        // If we have a Cloudinary URL, delete it from Cloudinary
        if (preview && preview.includes('cloudinary.com')) {
            // Extract public_id from URL (simple approach)
            const match = preview.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+/)
            if (match) {
                await deleteImage(match[1])
            }
        }

        setPreview(null)
        onChange(null)
        setError(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Product Image</label>

            {!preview ? (
                // Upload Zone
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragActive(true) }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                        isDragActive
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                    )}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-sm font-medium">Uploading to Cloudinary...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="h-10 w-10 text-muted-foreground" />
                            <p className="text-sm font-medium">
                                <span className="text-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (max 5MB)</p>
                        </div>
                    )}
                </div>
            ) : (
                // Preview Zone
                <div className="relative group rounded-lg overflow-hidden border bg-muted">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                            disabled={isUploading}
                        >
                            Replace
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                            disabled={isUploading}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                        </Button>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    {isUploading && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}
        </div>
    )
}
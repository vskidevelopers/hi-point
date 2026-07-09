/* eslint-disable react-hooks/set-state-in-effect */
// src/components/admin/ProductFormDialog.tsx
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { createProduct, updateProduct } from '@/app/actions/admin-product-actions'
import { Loader2 } from 'lucide-react'
import type { Product, Category } from '@/types'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface ProductFormDialogProps {
    isOpen: boolean
    onClose: () => void
    product?: Product | null
    categories: Category[]
}

export function ProductFormDialog({ isOpen, onClose, product, categories }: ProductFormDialogProps) {
    const isEditing = !!product

    const [name, setName] = useState(product?.name || '')
    const [slug, setSlug] = useState(product?.slug || '')
    const [description, setDescription] = useState(product?.description || '')
    const [basePrice, setBasePrice] = useState(product?.base_price?.toString() || '')
    const [imageUrl, setImageUrl] = useState(product?.image_url || '')
    const [categoryId, setCategoryId] = useState(product?.category_id || 'none')
    const [isInquiryOnly, setIsInquiryOnly] = useState(product?.is_inquiry_only || false)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Reset form when dialog opens/closes or product changes
    useEffect(() => {
        if (isOpen) {
            setName(product?.name || '')
            setSlug(product?.slug || '')
            setDescription(product?.description || '')
            setBasePrice(product?.base_price?.toString() || '')
            setImageUrl(product?.image_url || '')
            setCategoryId(product?.category_id || 'none')
            setIsInquiryOnly(product?.is_inquiry_only || false)
            setError(null)
        }
    }, [isOpen, product])

    async function handleSubmit() {
        if (!name || !basePrice) {
            setError('Name and Base Price are required.')
            return
        }

        setIsPending(true)
        setError(null)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('slug', slug)
        formData.append('description', description)
        formData.append('base_price', basePrice)
        formData.append('image_url', imageUrl)
        formData.append('category_id', categoryId)
        if (isInquiryOnly) formData.append('is_inquiry_only', 'on')

        const result = isEditing
            ? await updateProduct(product!.id, formData)
            : await createProduct(formData)

        setIsPending(false)

        if (result.success) {
            onClose()
        } else {
            setError(result.error || 'An unknown error occurred.')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update the details of this product.' : 'Fill in the details to add a new product to your catalog.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Product Name *</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Canon EOS R5" />
                        </div>
                        <div className="space-y-2">
                            <Label>URL Slug (Auto-generated if empty)</Label>
                            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="canon-eos-r5" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the product..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Base Price (KES) *</Label>
                            <Input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="0" />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={categoryId} onValueChange={(value) => setCategoryId(value || 'none')}>
                                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Category</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Image URL</Label>
                        <ImageUploader
                            value={imageUrl}
                            onChange={(url) => setImageUrl(url ?? '')}
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="inquiry_only"
                            checked={isInquiryOnly}
                            onCheckedChange={(checked) => setIsInquiryOnly(checked === true)}
                        />
                        <Label htmlFor="inquiry_only" className="cursor-pointer">
                            Inquiry Only (Hides &apos;Add to Cart&apos; and shows WhatsApp button instead)
                        </Label>
                    </div>

                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? 'Save Changes' : 'Create Product'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
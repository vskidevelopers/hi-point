// src/components/admin/ProductsTable.tsx
'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductFormDialog } from './ProductFormDialog'
import { deleteProduct } from '@/app/actions/admin-product-actions'
import { Edit, Trash2 } from 'lucide-react'
import type { Product, Category } from '@/types'

interface ProductsTableProps {
    products: Product[]
    categories: Category[]
}

export function ProductsTable({ products, categories }: ProductsTableProps) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    function openCreateDialog() {
        setEditingProduct(null)
        setIsDialogOpen(true)
    }

    function openEditDialog(product: Product) {
        setEditingProduct(product)
        setIsDialogOpen(true)
    }

    async function handleDelete(productId: string, productName: string) {
        if (window.confirm(`Are you sure you want to delete "${productName}"? This cannot be undone.`)) {
            await deleteProduct(productId)
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">All Products</h2>
                <Button onClick={openCreateDialog}>Add New Product</Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    No products found. Add your first product!
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => {
                                const category = categories.find(c => c.id === product.category_id)
                                return (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                                                {product.image_url && (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{category?.name || '-'}</TableCell>
                                        <TableCell>KES {Number(product.base_price).toLocaleString()}</TableCell>
                                        <TableCell>
                                            {product.is_inquiry_only ? (
                                                <Badge variant="outline">Inquiry Only</Badge>
                                            ) : (
                                                <Badge variant="secondary">Standard</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(product.id, product.name)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <ProductFormDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                product={editingProduct}
                categories={categories}
            />
        </>
    )
}
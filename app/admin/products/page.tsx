// src/app/(admin)/products/page.tsx
import { createClient } from '@/lib/supabase/server'
import { ProductsTable } from '@/components/admin/ProductsTable'

export default async function AdminProductsPage() {
    const supabase = await createClient()

    // Fetch products and categories in parallel
    const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
    ])

    const products = productsRes.data || []
    const categories = categoriesRes.data || []

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">Manage your retail catalog, pricing, and inquiry settings.</p>
            </div>

            <ProductsTable products={products} categories={categories} />
        </div>
    )
}
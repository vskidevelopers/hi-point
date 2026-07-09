// src/app/(public)/products/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default async function ProductsPage() {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight">Our Products</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Explore our range of genuine cameras, drones, lenses, and professional accessories.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product) => (
                    <Card key={product.id} className="flex flex-col overflow-hidden group">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                            )}
                        </div>
                        <CardContent className="pt-4 flex-grow">
                            <p className="text-xs text-muted-foreground uppercase">{product.categories?.name}</p>
                            <h3 className="font-semibold text-lg mt-1 line-clamp-1">{product.name}</h3>
                            <p className="text-lg font-bold mt-2">KES {product.base_price.toLocaleString()}</p>
                        </CardContent>
                        <CardFooter>
                            <Link
                                href={`/products/${product.slug}`}
                                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                            >
                                <ShoppingBag className="mr-2 h-4 w-4" /> View Details
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
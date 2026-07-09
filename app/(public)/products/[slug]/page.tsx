// src/app/(public)/products/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import Link from 'next/link'

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const supabase = await createClient()
    const { slug } = await params;

    const { data: product } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('slug', slug)
        .single()

    if (!product) notFound()

    const whatsappMessage = encodeURIComponent(`Hi High Point Technologies, I'm interested in the ${product.name} (KES ${product.base_price.toLocaleString()}). Is it available?`)
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <Link href="/products" className="text-sm text-muted-foreground hover:underline mb-6 inline-block">
                &larr; Back to Catalog
            </Link>

            <div className="grid md:grid-cols-2 gap-10">
                {/* Product Image */}
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">
                        {product.categories?.name || 'Product'}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
                    <p className="text-2xl font-bold mb-6">KES {product.base_price.toLocaleString()}</p>
                    <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">

                        {!product.is_inquiry_only && (
                            <AddToCartButton product={product} />
                        )}

                        <Button
                            variant={product.is_inquiry_only ? "default" : "outline"}
                            className="w-full sm:w-auto"
                        >
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Inquire via WhatsApp
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
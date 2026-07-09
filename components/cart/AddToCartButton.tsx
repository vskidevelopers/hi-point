// src/components/cart/AddToCartButton.tsx
'use client'

import { useCartStore } from '@/store/cart-store'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
    product: {
        id: string
        name: string
        base_price: number
        image_url: string | null
    }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem)
    const [isAdded, setIsAdded] = useState(false)
    const router = useRouter()

    const handleAdd = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.base_price,
            image_url: product.image_url,
        })
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000) // Reset after 2 seconds
        router.push('/checkout')
    }

    return (
        <Button
            onClick={handleAdd}
            className="w-full md:w-auto"
            variant={isAdded ? "outline" : "default"}
            disabled={isAdded}
        >
            {isAdded ? (
                <><Check className="mr-2 h-4 w-4" /> Added to Cart</>
            ) : (
                <><ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart</>
            )}
        </Button>
    )
}
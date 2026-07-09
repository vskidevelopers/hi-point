// src/components/cart/CartSheet.tsx
'use client'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { useRouter } from "next/navigation"

export function CartSheet() {
    const router = useRouter()
    const items = useCartStore((state) => state.items)
    const removeItem = useCartStore((state) => state.removeItem)
    const updateQuantity = useCartStore((state) => state.updateQuantity)
    const subtotal = useCartStore((state) => state.subtotal)
    const totalItems = useCartStore((state) => state.totalItems)

    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {totalItems()}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Your Cart ({totalItems()} items)</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {items.length === 0 ? (
                        <p className="text-center text-muted-foreground py-10">Your cart is empty.</p>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b pb-4">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                    {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <h3 className="font-medium line-clamp-1">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">KES {item.price.toLocaleString()}</p>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto text-red-500 hover:text-red-700" onClick={() => removeItem(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Subtotal</span>
                            <span>KES {subtotal().toLocaleString()}</span>
                        </div>
                        <Button className="w-full" size="lg" onClick={() => router.push('/checkout')}>
                            Proceed to Checkout
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(public)/checkout/page.tsx
'use client'
import { buttonVariants } from "@/components/ui/button"
import { useState } from 'react'
import { useCartStore } from '@/store/cart-store'
import { submitOrder } from '@/app/actions/order-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Loader2, CheckCircle2, MapPin, Store } from 'lucide-react'
import { MPESA_DETAILS } from '@/lib/constants'
import Link from 'next/link'


export default function CheckoutPage() {

    const items = useCartStore((state) => state.items)
    const subtotal = useCartStore((state) => state.subtotal)
    const clearCart = useCartStore((state) => state.clearCart)

    const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup')
    const [state, setState] = useState<'idle' | 'pending' | 'success'>('idle')
    const [orderNumber, setOrderNumber] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        if (items.length === 0) {
            setErrorMessage('Your cart is empty.')
            return
        }

        setState('pending')
        setErrorMessage(null)

        // Attach cart items as a JSON string so the server action can read them
        formData.append('cart_items', JSON.stringify(items))

        const result = await submitOrder(formData)

        if (result.success) {
            setState('success')
            setOrderNumber(result.orderNumber!)
            clearCart() // Clear the browser cart after successful order
        } else {
            setState('idle')
            setErrorMessage(result.error || 'An unknown error occurred.')
        }
    }

    // --- SUCCESS STATE ---
    if (state === 'success') {
        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <Card className="text-center">
                    <CardHeader>
                        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                        <CardTitle className="text-2xl mt-4">Order Placed Successfully!</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Thank you for your order. We have received your M-Pesa details and will confirm your payment shortly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg inline-block">
                            <p className="text-sm text-gray-500">Your Order Number</p>
                            <p className="text-2xl font-bold font-mono text-primary">{orderNumber}</p>
                        </div>
                        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                            You can track your order status on our <Link href="/track" className="text-primary underline font-medium">Tracking Page</Link>.
                        </p>
                        c
                    </CardContent>
                </Card>
            </div>
        )
    }

    // --- EMPTY CART STATE ---
    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Link href="/products" className={buttonVariants()}>
                    Browse Products
                </Link>
            </div>
        )
    }

    // --- CHECKOUT FORM ---
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <form action={handleSubmit} className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Form Details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Customer Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="customer_name">Full Name *</Label>
                                    <Input id="customer_name" name="customer_name" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="customer_phone">Phone Number *</Label>
                                    <Input id="customer_phone" name="customer_phone" required placeholder="0712 345 678" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="customer_email">Email (Optional)</Label>
                                <Input id="customer_email" name="customer_email" type="email" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fulfillment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Fulfillment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <RadioGroup
                                name="fulfillment_type"
                                defaultValue="pickup"
                                onValueChange={(val) => setFulfillment(val as any)}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div>
                                    <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                                    <Label
                                        htmlFor="pickup"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <Store className="mb-3 h-6 w-6" />
                                        Shop Pickup
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                                    <Label
                                        htmlFor="delivery"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <MapPin className="mb-3 h-6 w-6" />
                                        Delivery
                                    </Label>
                                </div>
                            </RadioGroup>

                            {fulfillment === 'delivery' && (
                                <div className="grid gap-2 pt-2">
                                    <Label htmlFor="delivery_location">Delivery Location *</Label>
                                    <Textarea
                                        id="delivery_location"
                                        name="delivery_location"
                                        placeholder="Enter your exact delivery address..."
                                        required={fulfillment === 'delivery'}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        * Delivery fees will be calculated and communicated to you by our team.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment (M-Pesa)</CardTitle>
                            <CardDescription>
                                Please send the total amount to the till number below and enter the transaction code.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-sm text-green-800 dark:text-green-300 font-medium">Lipa Na M-Pesa</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-200">Till: {MPESA_DETAILS.tillNumber}</p>
                                <p className="text-sm text-green-800 dark:text-green-300">Account: {MPESA_DETAILS.accountName}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="mpesa_code">M-Pesa Transaction Code *</Label>
                                <Input
                                    id="mpesa_code"
                                    name="mpesa_code"
                                    required
                                    placeholder="e.g., QFG3P5X8B9"
                                    className="uppercase"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Order Summary */}
                <div className="md:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="truncate pr-2">{item.name} x {item.quantity}</span>
                                        <span className="font-medium whitespace-nowrap">KES {(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>KES {subtotal().toLocaleString()}</span>
                            </div>

                            {errorMessage && (
                                <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
                            )}

                            <Button type="submit" className="w-full" size="lg" disabled={state === 'pending'}>
                                {state === 'pending' ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}
// src/components/admin/OrderDetailsDialog.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { updateOrderStatus } from '@/app/actions/admin-order-actions'
import { Loader2 } from 'lucide-react'
import type { Order, OrderItem } from '@/types'

interface OrderWithItems extends Order {
    order_items: OrderItem[]
}

interface OrderDetailsDialogProps {
    order: OrderWithItems | null
    isOpen: boolean
    onClose: () => void
}

export function OrderDetailsDialog({ order, isOpen, onClose }: OrderDetailsDialogProps) {
    const [paymentStatus, setPaymentStatus] = useState<string>(order?.payment_status || 'pending')
    const [orderStatus, setOrderStatus] = useState<string>(order?.order_status || 'pending_payment')
    const [deliveryFee, setDeliveryFee] = useState(order?.delivery_fee?.toString() || '0')
    const [isPending, setIsPending] = useState(false)

    // Reset state when the dialog opens with a new order
    if (order && paymentStatus !== order.payment_status) setPaymentStatus(order.payment_status)
    if (order && orderStatus !== order.order_status) setOrderStatus(order.order_status)

    async function handleSubmit() {
        if (!order) return
        setIsPending(true)
        const fee = order.fulfillment_type === 'delivery' ? parseFloat(deliveryFee) || 0 : 0
        await updateOrderStatus(order.id, paymentStatus, orderStatus, fee)
        setIsPending(false)
        onClose()
    }

    if (!order) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order {order.order_number}</DialogTitle>
                    <DialogDescription>Placed on {new Date(order.created_at).toLocaleString()}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Customer & Fulfillment Info */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-semibold mb-2">Customer</h4>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-muted-foreground">{order.customer_phone}</p>
                            {order.customer_email && <p className="text-muted-foreground">{order.customer_email}</p>}
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Fulfillment</h4>
                            <p className="font-medium capitalize">{order.fulfillment_type}</p>
                            {order.delivery_location && <p className="text-muted-foreground text-xs mt-1">{order.delivery_location}</p>}
                        </div>
                    </div>

                    <Separator />

                    {/* Items & Financials */}
                    <div>
                        <h4 className="font-semibold mb-2">Items</h4>
                        <div className="space-y-2">
                            {order.order_items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.product_name} x {item.quantity}</span>
                                    <span>KES {(item.unit_price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-3" />
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>KES {Number(order.subtotal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery Fee</span>
                                <span>KES {Number(order.delivery_fee || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base pt-1 border-t">
                                <span>Total</span>
                                <span>KES {Number(order.total_amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Update Form */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Update Order Status</h4>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Payment Status</Label>
                                <Select value={paymentStatus} onValueChange={(value) => value && setPaymentStatus(value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Order Status</Label>
                                <Select value={orderStatus} onValueChange={(value) => value && setOrderStatus(value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending_payment">Pending Payment</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="ready_for_collection">Ready for Collection</SelectItem>
                                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {order.fulfillment_type === 'delivery' && (
                            <div className="space-y-2">
                                <Label>Delivery Fee (KES)</Label>
                                <Input
                                    type="number"
                                    value={deliveryFee}
                                    onChange={(e) => setDeliveryFee(e.target.value)}
                                    placeholder="0"
                                />
                                <p className="text-xs text-muted-foreground">Updating this will automatically recalculate the total amount.</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleSubmit} disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
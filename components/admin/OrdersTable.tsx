// src/components/admin/OrdersTable.tsx
'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrderDetailsDialog } from './OrderDetailsDialog'
import type { Order, OrderItem } from '@/types'

interface OrderWithItems extends Order {
    order_items: OrderItem[]
}

function getStatusColor(status: string) {
    if (status.includes('completed') || status === 'paid') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    if (status.includes('cancelled')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    if (status.includes('progress') || status.includes('processing') || status.includes('delivery')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
}

export function OrdersTable({ orders }: { orders: OrderWithItems[] }) {
    const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    function openDialog(order: OrderWithItems) {
        setSelectedOrder(order)
        setIsDialogOpen(true)
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Fulfillment</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono font-medium">{order.order_number}</TableCell>
                                    <TableCell>{order.customer_name}</TableCell>
                                    <TableCell className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="capitalize">{order.fulfillment_type}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(order.payment_status)}>
                                            {order.payment_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(order.order_status)}>
                                            {order.order_status.replace(/_/g, ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">KES {Number(order.total_amount).toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => openDialog(order)}>
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <OrderDetailsDialog
                order={selectedOrder}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    )
}
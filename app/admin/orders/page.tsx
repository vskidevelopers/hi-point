// src/app/(admin)/orders/page.tsx
import { createClient } from '@/lib/supabase/server'
import { OrdersTable } from '@/components/admin/OrdersTable'

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    // Fetch all orders with their line items, newest first
    const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">Manage retail orders, confirm payments, and update fulfillment statuses.</p>
            </div>

            <OrdersTable orders={orders || []} />
        </div>
    )
}
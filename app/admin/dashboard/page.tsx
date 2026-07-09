// src/app/(admin)/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Wrench, Package, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Fetch counts and recent data in parallel
    const [
        { count: ordersCount },
        { count: ticketsCount },
        { count: productsCount },
        { data: recentOrders },
        { data: recentTickets }
    ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('service_tickets').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('order_number, customer_name, total_amount, order_status, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('service_tickets').select('ticket_number, customer_name, device_brand, device_model, status, created_at').order('created_at', { ascending: false }).limit(5),
    ])

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back. Here is an overview of your business.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ordersCount ?? 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Repair Tickets</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ticketsCount ?? 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productsCount ?? 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {/* TODO: We will calculate the exact sum of 'paid' orders in a later update */}
                        <div className="text-2xl font-bold">KES 0</div>
                        <p className="text-xs text-muted-foreground">From confirmed payments</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        <Link href="/admin/orders" className={buttonVariants({ variant: "outline", size: "sm" })}>
                            View All
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders?.map((order) => (
                                <div key={order.order_number} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div>
                                        <p className="font-medium">{order.order_number}</p>
                                        <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">KES {Number(order.total_amount).toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{order.order_status.replace(/_/g, ' ')}</p>
                                    </div>
                                </div>
                            ))}
                            {(!recentOrders || recentOrders.length === 0) && <p className="text-sm text-muted-foreground">No orders yet.</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Repair Tickets</CardTitle>
                        <Link href="/admin/tickets" className={buttonVariants({ variant: "outline", size: "sm" })}>
                            View All
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTickets?.map((ticket) => (
                                <div key={ticket.ticket_number} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div>
                                        <p className="font-medium">{ticket.ticket_number}</p>
                                        <p className="text-sm text-muted-foreground">{ticket.device_brand} {ticket.device_model}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium px-2 py-1 rounded-full bg-muted capitalize">
                                            {ticket.status.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {(!recentTickets || recentTickets.length === 0) && <p className="text-sm text-muted-foreground">No tickets yet.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
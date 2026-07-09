/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/tracking/TrackingResult.tsx
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Package, Wrench, CheckCircle2, Clock, XCircle } from 'lucide-react'

// Helper to format status strings nicely
function formatStatus(status: string) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function getStatusColor(status: string) {
    if (status.includes('completed') || status.includes('paid') || status.includes('ready'))
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    if (status.includes('cancelled'))
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    if (status.includes('progress') || status.includes('processing'))
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
}

export function TrackingResult({ type, data }: { type: 'order' | 'ticket', data: any }) {

    // --- RETAIL ORDER VIEW ---
    if (type === 'order') {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-xl">Order Details</CardTitle>
                    </div>
                    <Badge className={getStatusColor(data.order_status)}>
                        {formatStatus(data.order_status)}
                    </Badge>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-muted-foreground">Order Number:</p>
                            <p className="font-mono font-medium">{data.order_number}</p>

                            <p className="text-muted-foreground">Date:</p>
                            <p>{new Date(data.created_at).toLocaleDateString()}</p>

                            <p className="text-muted-foreground">Fulfillment:</p>
                            <p className="capitalize">{data.fulfillment_type}</p>

                            {data.delivery_location && (
                                <>
                                    <p className="text-muted-foreground">Delivery Location:</p>
                                    <p>{data.delivery_location}</p>
                                </>
                            )}

                            <p className="text-muted-foreground">Total Amount:</p>
                            <p className="font-bold">KES {Number(data.total_amount).toLocaleString()}</p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="font-medium mb-2">Items</h4>
                            <div className="space-y-2">
                                {data.order_items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.product_name} x {item.quantity}</span>
                                        <span>KES {Number(item.unit_price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // --- REPAIR TICKET VIEW ---
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-xl">Repair Ticket Details</CardTitle>
                </div>
                <Badge className={getStatusColor(data.status)}>
                    {formatStatus(data.status)}
                </Badge>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">Ticket Number:</p>
                        <p className="font-mono font-medium">{data.ticket_number}</p>

                        <p className="text-muted-foreground">Device:</p>
                        <p>{data.device_brand} {data.device_model}</p>

                        <p className="text-muted-foreground">Issue:</p>
                        <p className="col-span-2">{data.issue_description}</p>

                        {data.consultation_fee > 0 && (
                            <>
                                <p className="text-muted-foreground">Consultation Fee:</p>
                                <p>KES {Number(data.consultation_fee).toLocaleString()}</p>
                            </>
                        )}

                        {data.repair_quote > 0 && (
                            <>
                                <p className="text-muted-foreground">Repair Quote:</p>
                                <p className="font-bold">KES {Number(data.repair_quote).toLocaleString()}</p>
                            </>
                        )}
                    </div>

                    <Separator />

                    <div>
                        <h4 className="font-medium mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Status Timeline
                        </h4>
                        <div className="space-y-4 border-l-2 border-muted pl-4">
                            {data.ticket_updates.map((update: any, index: number) => {
                                const isLast = index === data.ticket_updates.length - 1
                                const Icon = update.new_status === 'completed' ? CheckCircle2 :
                                    update.new_status === 'cancelled' ? XCircle : Clock

                                return (
                                    <div key={update.id} className="relative">
                                        <div className={`absolute -left-[21px] w-4 h-4 rounded-full border-2 border-background flex items-center justify-center ${isLast ? 'bg-primary' : 'bg-muted'}`}>
                                            <Icon className="h-2.5 w-2.5 text-primary-foreground" />
                                        </div>
                                        <div className="mb-1">
                                            <p className="font-medium text-sm">{formatStatus(update.new_status)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(update.created_at).toLocaleString()}
                                            </p>
                                            {update.admin_notes && (
                                                <p className="text-sm mt-1 text-muted-foreground italic">
                                                    &quot;{update.admin_notes}&quot;
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
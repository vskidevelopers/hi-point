// src/components/admin/TicketDetailsDialog.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { updateTicketDetails } from '@/app/actions/admin-ticket-actions'
import { Loader2, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react'
import type { ServiceTicket, TicketUpdate } from '@/types'
import { QuoteDialog } from './QuoteDialog'

import { cn } from '@/lib/utils'

interface TicketWithUpdates extends ServiceTicket {
    ticket_updates: TicketUpdate[]
    quote_generated_at?: string | null
}

interface TicketDetailsDialogProps {
    ticket: TicketWithUpdates | null
    isOpen: boolean
    onClose: () => void
}
const TICKET_STATUSES = [
    { value: 'pending_assessment', label: 'Pending Assessment' },
    { value: 'awaiting_consultation_fee', label: 'Awaiting Consultation Fee' },
    { value: 'awaiting_repair_quote', label: 'Awaiting Repair Quote' },
    { value: 'repair_in_progress', label: 'Repair in Progress' },
    { value: 'ready_for_collection', label: 'Ready for Collection' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
]

function getStatusColor(status: string) {
    if (status.includes('completed') || status.includes('ready')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    if (status.includes('cancelled')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    if (status.includes('progress')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
}

export function TicketDetailsDialog({ ticket, isOpen, onClose }: TicketDetailsDialogProps) {
    const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false)
    const [status, setStatus] = useState<string>(ticket?.status || 'pending_assessment')
    const [consultationFee, setConsultationFee] = useState(ticket?.consultation_fee?.toString() || '0')
    const [repairQuote, setRepairQuote] = useState(ticket?.repair_quote?.toString() || '0')
    const [adminNotes, setAdminNotes] = useState('')
    const [isPending, setIsPending] = useState(false)

    // Reset state when dialog opens with a new ticket
    if (ticket && status !== ticket.status) setStatus(ticket.status)

    async function handleSubmit() {
        if (!ticket) return
        setIsPending(true)

        await updateTicketDetails(
            ticket.id,
            ticket.status,
            status,
            parseFloat(consultationFee) || 0,
            parseFloat(repairQuote) || 0,
            adminNotes
        )

        setIsPending(false)
        setAdminNotes('') // Clear notes after submission
        onClose()
    }

    if (!ticket) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between gap-3">
                        <DialogTitle>Ticket {ticket.ticket_number}</DialogTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsQuoteDialogOpen(true)}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                {ticket.quote_generated_at ? 'View Quote' : 'Generate Quote'}
                            </Button>
                            <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status.replace(/_/g, ' ').toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                    <DialogDescription>Created on {new Date(ticket.created_at).toLocaleString()}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Customer & Device Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase">Customer Details</h4>
                            <p className="font-medium">{ticket.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{ticket.customer_phone}</p>
                            {ticket.customer_email && <p className="text-sm text-muted-foreground">{ticket.customer_email}</p>}
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase">Device Info</h4>
                            <p className="font-medium">{ticket.device_brand} {ticket.device_model}</p>
                            <p className="text-sm text-muted-foreground mt-1">{ticket.issue_description}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Timeline */}
                    <div>
                        <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Status Timeline
                        </h4>
                        <div className="space-y-3 border-l-2 border-muted pl-4 max-h-48 overflow-y-auto">
                            {ticket.ticket_updates.map((update, index) => {
                                const isLast = index === ticket.ticket_updates.length - 1
                                const Icon = update.new_status === 'completed' ? CheckCircle2 :
                                    update.new_status === 'cancelled' ? XCircle : Clock

                                return (
                                    <div key={update.id} className="relative">
                                        <div className={cn(
                                            "absolute -left-[21px] w-4 h-4 rounded-full border-2 border-background flex items-center justify-center",
                                            isLast ? 'bg-primary' : 'bg-muted'
                                        )}>
                                            <Icon className="h-2.5 w-2.5 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{update.new_status.replace(/_/g, ' ')}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(update.created_at).toLocaleString()}</p>
                                            {update.admin_notes && (
                                                <p className="text-sm mt-1 text-muted-foreground italic bg-muted/50 p-2 rounded">
                                                    &quot;{update.admin_notes}&quot;
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <Separator />

                    {/* Update Form */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase">Update Ticket</h4>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>New Status</Label>
                                <Select value={status} onValueChange={(value: string | null) => setStatus(value ?? 'pending_assessment')}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {TICKET_STATUSES.map(s => (
                                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Consultation Fee (KES)</Label>
                                <Input
                                    type="number"
                                    value={consultationFee}
                                    onChange={(e) => setConsultationFee(e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Repair Quote (KES)</Label>
                                <Input
                                    type="number"
                                    value={repairQuote}
                                    onChange={(e) => setRepairQuote(e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Admin Notes / Message to Customer</Label>
                            <Textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="e.g., 'Screen replacement requires 2 days. Please pay consultation fee to proceed.'"
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">These notes will be visible to the customer on their tracking page.</p>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleSubmit} disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save & Notify
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <QuoteDialog
                ticket={ticket}
                isOpen={isQuoteDialogOpen}
                onClose={() => setIsQuoteDialogOpen(false)}
            />
        </Dialog>
    )
}
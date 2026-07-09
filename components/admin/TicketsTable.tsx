// src/components/admin/TicketsTable.tsx
'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TicketDetailsDialog } from './TicketDetailsDialog'
import type { ServiceTicket, TicketUpdate } from '@/types'

interface TicketWithUpdates extends ServiceTicket {
    ticket_updates: TicketUpdate[]
}

function getStatusColor(status: string) {
    if (status.includes('completed') || status.includes('ready')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    if (status.includes('cancelled')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    if (status.includes('progress')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
}

export function TicketsTable({ tickets }: { tickets: TicketWithUpdates[] }) {
    const [selectedTicket, setSelectedTicket] = useState<TicketWithUpdates | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    function openDialog(ticket: TicketWithUpdates) {
        setSelectedTicket(ticket)
        setIsDialogOpen(true)
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ticket #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Device</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Consultation</TableHead>
                            <TableHead>Quote</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                    No repair tickets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-mono font-medium">{ticket.ticket_number}</TableCell>
                                    <TableCell>{ticket.customer_name}</TableCell>
                                    <TableCell className="text-muted-foreground">{ticket.device_brand} {ticket.device_model}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(ticket.status)}>
                                            {ticket.status.replace(/_/g, ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>KES {Number(ticket.consultation_fee || 0).toLocaleString()}</TableCell>
                                    <TableCell>KES {Number(ticket.repair_quote || 0).toLocaleString()}</TableCell>
                                    <TableCell className="text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => openDialog(ticket)}>
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <TicketDetailsDialog
                ticket={selectedTicket}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    )
}
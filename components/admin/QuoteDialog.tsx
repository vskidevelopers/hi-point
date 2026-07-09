// src/components/admin/QuoteDialog.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PDFViewer, pdf } from '@react-pdf/renderer'
import { RepairQuoteDocument } from '@/components/pdf/RepairQuoteDocument'
import { Download, FileText, Loader2 } from 'lucide-react'
import type { ServiceTicket, TicketUpdate } from '@/types'
import { createClient } from '@/lib/supabase/client'

interface TicketWithUpdates extends ServiceTicket {
    ticket_updates: TicketUpdate[]
    quote_generated_at?: string | null
}

interface QuoteDialogProps {
    ticket: TicketWithUpdates | null
    isOpen: boolean
    onClose: () => void
}

export function QuoteDialog({ ticket, isOpen, onClose }: QuoteDialogProps) {
    const [isDownloading, setIsDownloading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    if (!ticket) return null

    async function handleDownload() {
        setIsDownloading(true)
        try {
            // Generate the PDF blob
            const blob = await pdf(<RepairQuoteDocument ticket={ticket!} />).toBlob()

            // Create a download link
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `Quote-${ticket?.ticket_number}-${ticket?.customer_name.replace(/\s+/g, '-')}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Download error:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    async function handleSaveQuote() {
        setIsSaving(true)
        try {
            const supabase = createClient()
            await supabase
                .from('service_tickets')
                .update({ quote_generated_at: new Date().toISOString() })
                .eq('id', ticket?.id)
        } catch (error) {
            console.error('Save error:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <DialogTitle>Repair Quote Preview</DialogTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSaveQuote}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                                ) : (
                                    'Save Quote Record'
                                )}
                            </Button>
                            <Button size="sm" onClick={handleDownload} disabled={isDownloading}>
                                {isDownloading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                                ) : (
                                    <><Download className="mr-2 h-4 w-4" /> Download PDF</>
                                )}
                            </Button>
                        </div>
                    </div>
                    <DialogDescription>
                        Quote for {ticket.customer_name} — {ticket.ticket_number}
                        {ticket?.quote_generated_at && (
                            <span className="ml-2 text-green-600">
                                ✓ Last generated on {new Date(ticket?.quote_generated_at).toLocaleDateString()}
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-[70vh] border rounded-md overflow-hidden bg-gray-100">
                    <PDFViewer
                        width="100%"
                        height="100%"
                        showToolbar={true}
                        className="w-full h-full"
                    >
                        <RepairQuoteDocument ticket={ticket} />
                    </PDFViewer>
                </div>
            </DialogContent>
        </Dialog>
    )
}
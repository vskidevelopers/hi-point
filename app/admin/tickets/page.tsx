// src/app/(admin)/tickets/page.tsx
import { createClient } from '@/lib/supabase/server'
import { TicketsTable } from '@/components/admin/TicketsTable'

export default async function AdminTicketsPage() {
    const supabase = await createClient()

    // Fetch all tickets with their timeline updates, newest first
    const { data: tickets } = await supabase
        .from('service_tickets')
        .select('*, ticket_updates(*)')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Repair Tickets</h1>
                <p className="text-muted-foreground">Manage device diagnostics, quotes, and repair lifecycles.</p>
            </div>

            <TicketsTable tickets={tickets || []} />
        </div>
    )
}
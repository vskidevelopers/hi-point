// src/app/track/page.tsx
import { TrackingForm } from '@/components/tracking/TrackingForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Track Order or Repair | High Point Technologies',
    description: 'Track the status of your retail order or camera/drone repair ticket using your reference number and phone number.',
}

export default function TrackPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight">Track Your Status</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Enter your reference number and phone number to view the latest updates on your order or repair ticket.
                </p>
            </div>

            <TrackingForm />
        </div>
    )
}

import { RepairRequestForm } from '@/components/forms/RepairRequestForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Request a Repair | High Point Technologies',
    description: 'Submit a repair request for your camera, drone, or imaging equipment. Fast diagnostics and professional repair services in Nairobi.',
}

export default function RepairRequestPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight">Repair Request Form</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Drop off your device or submit a request online. Our expert technicians will diagnose the issue and provide a transparent quote.
                </p>
            </div>

            <RepairRequestForm />
        </div>
    )
}
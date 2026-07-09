// src/components/forms/RepairRequestForm.tsx
'use client'

import { useState } from 'react'
import { submitRepairRequest } from '@/app/actions/repair-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, Loader2 } from 'lucide-react'

export function RepairRequestForm() {
    const [state, setState] = useState<'idle' | 'pending' | 'success'>('idle')
    const [ticketNumber, setTicketNumber] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setState('pending')
        setErrorMessage(null)

        const result = await submitRepairRequest(formData)

        if (result.success) {
            setState('success')
            setTicketNumber(result.ticketNumber!)
        } else {
            setState('idle')
            setErrorMessage(result.error || 'An unknown error occurred.')
        }
    }

    // Success State UI
    if (state === 'success') {
        return (
            <Card className="max-w-2xl mx-auto text-center">
                <CardHeader>
                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                    <CardTitle className="text-2xl mt-4">Request Submitted Successfully!</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Your repair ticket has been created. Please save your ticket number for tracking.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg inline-block">
                        <p className="text-sm text-gray-500">Your Ticket Number</p>
                        <p className="text-2xl font-bold font-mono text-primary">{ticketNumber}</p>
                    </div>
                    <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                        Our team will assess your device and contact you shortly on the phone number provided.
                        You can also track your repair status on our <a href="/track" className="text-primary underline font-medium">Tracking Page</a>.
                    </p>
                </CardContent>
            </Card>
        )
    }

    // Form UI
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Request a Repair</CardTitle>
                <CardDescription>
                    Fill out the form below to initiate a repair request. Our team will assess your device and contact you with a consultation fee and repair quote.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="customer_name">Full Name *</Label>
                            <Input id="customer_name" name="customer_name" required placeholder="John Doe" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="customer_phone">Phone Number *</Label>
                            <Input id="customer_phone" name="customer_phone" required placeholder="0712 345 678" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="customer_email">Email Address (Optional)</Label>
                        <Input id="customer_email" name="customer_email" type="email" placeholder="john@example.com" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="device_brand">Device Brand *</Label>
                            <Input id="device_brand" name="device_brand" required placeholder="e.g., Canon, DJI, Sony" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="device_model">Device Model *</Label>
                            <Input id="device_model" name="device_model" required placeholder="e.g., EOS R5, Mavic 3" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="issue_description">Describe the Issue *</Label>
                        <Textarea
                            id="issue_description"
                            name="issue_description"
                            required
                            placeholder="Please provide as much detail as possible about the problem..."
                            rows={5}
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={state === 'pending'}>
                        {state === 'pending' ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Repair Request'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
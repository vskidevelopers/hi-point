/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/tracking/TrackingForm.tsx
'use client'

import { useState } from 'react'
import { trackReference } from '@/app/actions/tracking-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Search } from 'lucide-react'
import { TrackingResult } from './TrackingResult'

export function TrackingForm() {
    const [state, setState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
    const [result, setResult] = useState<any>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setState('pending')
        setErrorMessage(null)
        setResult(null)

        const ref = formData.get('reference_number') as string
        const phone = formData.get('phone_number') as string

        const res = await trackReference(ref, phone)

        if (res.success) {
            setState('success')
            setResult(res)
        } else {
            setState('error')
            setErrorMessage(res.error ?? null)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Track Your Order or Repair</CardTitle>
                    <CardDescription>
                        Enter your reference number and the phone number used during the request.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reference_number">Reference Number</Label>
                            <Input id="reference_number" name="reference_number" required placeholder="e.g., HP-ORD-1001 or HP-REP-5001" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <Input id="phone_number" name="phone_number" required placeholder="0712 345 678" />
                        </div>

                        {state === 'error' && errorMessage && (
                            <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
                        )}

                        <Button type="submit" className="w-full" disabled={state === 'pending'}>
                            {state === 'pending' ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Tracking...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Track Status
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {state === 'success' && result && (
                <TrackingResult type={result.type} data={result.data} />
            )}
        </div>
    )
}
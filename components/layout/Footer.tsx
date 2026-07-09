// src/components/layout/Footer.tsx
import Link from 'next/link'
import { Camera, Phone, MapPin, Mail } from 'lucide-react'
import { DISPLAY_PHONE, LOCATION, BUSINESS_HOURS } from '@/lib/constants'

export function Footer() {
    return (
        <footer className="border-t bg-muted/40 mt-auto">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Column 1: Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <Camera className="h-6 w-6 text-primary" />
                            High Point Tech
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your trusted camera and drone experts in Nairobi. Sales, repairs, accessories, and technical support.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/products" className="text-muted-foreground hover:text-primary">Shop Products</Link></li>
                            <li><Link href="/services" className="text-muted-foreground hover:text-primary">Our Services</Link></li>
                            <li><Link href="/services/request" className="text-muted-foreground hover:text-primary">Book a Repair</Link></li>
                            <li><Link href="/track" className="text-muted-foreground hover:text-primary">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Services */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Services</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="text-muted-foreground">Camera Repairs & Diagnostics</li>
                            <li className="text-muted-foreground">Drone Maintenance</li>
                            <li className="text-muted-foreground">Sensor Cleaning & Calibration</li>
                            <li className="text-muted-foreground">Genuine Spare Parts</li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                <span>{LOCATION.address}</span>
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                <a href={`tel:${DISPLAY_PHONE.replace(/\s/g, '')}`} className="hover:text-primary">{DISPLAY_PHONE}</a>
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                <a href="mailto:info@highpointtech.co.ke" className="hover:text-primary">info@highpointtech.co.ke</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t">
                <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} High Point Technologies. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Precision. Performance. Reliability.
                    </p>
                </div>
            </div>
        </footer>
    )
}
// src/components/layout/Footer.tsx

import Link from 'next/link'
import {
    Camera,
    Mail,
    MapPin,
    Phone,
    Wrench,
    ShoppingBag,
    PackageSearch,
} from 'lucide-react'

import {
    BUSINESS_HOURS,
    DISPLAY_PHONE,
    LOCATION,
} from '@/lib/constants'

export function Footer() {
    return (
        <footer className="mt-24 border-t border-border/50 bg-linear-to-b from-background to-muted/40">

            <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

                    {/* ================= BRAND ================= */}

                    <div className="space-y-6">

                        <Link
                            href="/"
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                                <Camera className="h-6 w-6 text-primary" />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    High Point Tech
                                </h2>

                                <p className="text-xs text-muted-foreground">
                                    Cameras • Drones • Repairs
                                </p>
                            </div>
                        </Link>

                        <p className="leading-7 text-sm text-muted-foreground">
                            Nairobi&apos;s trusted destination for professional
                            camera sales, drone solutions, repairs,
                            diagnostics, genuine accessories and technical
                            support.
                        </p>

                        <div className="rounded-2xl border bg-background/70 p-4">

                            <p className="text-sm font-semibold">
                                Business Hours
                            </p>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {BUSINESS_HOURS.weekdays}
                                <br />
                                {BUSINESS_HOURS.saturday}
                                <br />
                                {BUSINESS_HOURS.sunday}
                            </p>

                        </div>

                    </div>

                    {/* ================= QUICK LINKS ================= */}

                    <div>

                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider">
                            Quick Links
                        </h3>

                        <div className="space-y-3">

                            <Link
                                href="/products"
                                className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-background"
                            >
                                <ShoppingBag className="h-4 w-4 text-primary" />

                                <span className="text-sm text-muted-foreground group-hover:text-foreground">
                                    Shop Products
                                </span>
                            </Link>

                            <Link
                                href="/services"
                                className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-background"
                            >
                                <Camera className="h-4 w-4 text-primary" />

                                <span className="text-sm text-muted-foreground group-hover:text-foreground">
                                    Our Services
                                </span>
                            </Link>

                            <Link
                                href="/services/request"
                                className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-background"
                            >
                                <Wrench className="h-4 w-4 text-primary" />

                                <span className="text-sm text-muted-foreground group-hover:text-foreground">
                                    Book a Repair
                                </span>
                            </Link>

                            <Link
                                href="/track"
                                className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-background"
                            >
                                <PackageSearch className="h-4 w-4 text-primary" />

                                <span className="text-sm text-muted-foreground group-hover:text-foreground">
                                    Track Your Order
                                </span>
                            </Link>

                        </div>

                    </div>

                    {/* ================= SERVICES ================= */}

                    <div>

                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider">
                            Our Expertise
                        </h3>

                        <div className="space-y-3">

                            {[
                                'Camera Repairs & Diagnostics',
                                'Drone Maintenance',
                                'Sensor Cleaning & Calibration',
                                'Lens Servicing',
                                'Camera Accessories',
                                'Genuine Spare Parts',
                            ].map((service) => (

                                <div
                                    key={service}
                                    className="rounded-xl bg-background/60 px-4 py-3 text-sm text-muted-foreground"
                                >
                                    {service}
                                </div>

                            ))}

                        </div>

                    </div>

                    {/* ================= CONTACT ================= */}

                    <div>

                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider">
                            Contact Us
                        </h3>

                        <div className="space-y-4">

                            <div className="flex gap-4 rounded-2xl bg-background/60 p-4">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>

                                <div>

                                    <p className="text-sm font-medium">
                                        Visit Us
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {LOCATION.address}
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-4 rounded-2xl bg-background/60 p-4">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>

                                <div>

                                    <p className="text-sm font-medium">
                                        Call Us
                                    </p>

                                    <a
                                        href={`tel:${DISPLAY_PHONE.replace(/\s/g, '')}`}
                                        className="mt-1 block text-sm text-muted-foreground transition hover:text-primary"
                                    >
                                        {DISPLAY_PHONE}
                                    </a>

                                </div>

                            </div>

                            <div className="flex gap-4 rounded-2xl bg-background/60 p-4">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>

                                <div>

                                    <p className="text-sm font-medium">
                                        Email
                                    </p>

                                    <a
                                        href="mailto:info@highpointtech.co.ke"
                                        className="mt-1 block text-sm text-muted-foreground transition hover:text-primary"
                                    >
                                        info@highpointtech.co.ke
                                    </a>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================= BOTTOM BAR ================= */}

            <div className="border-t border-border/50 bg-background/80">

                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-center md:flex-row lg:px-8">

                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} High Point Technologies.
                        All rights reserved.
                    </p>

                    <p className="rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
                        Precision • Performance • Reliability
                    </p>

                </div>

            </div>

        </footer>
    )
}
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Camera,
    Menu,
    Wrench,
    Home,
    Store,
    Settings,
    PackageSearch,
} from 'lucide-react'
import { useState } from 'react'

import { CartSheet } from '@/components/cart/CartSheet'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navLinks = [
    {
        href: '/',
        label: 'Home',
        icon: Home,
    },
    {
        href: '/products',
        label: 'Shop',
        icon: Store,
    },
    {
        href: '/services',
        label: 'Services',
        icon: Settings,
    },
    {
        href: '/track',
        label: 'Track Order',
        icon: PackageSearch,
    },
]

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* ================= LOGO ================= */}

                <Link
                    href="/"
                    className="flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
                        <Camera className="h-5 w-5 text-primary" />
                    </div>

                    <div className="leading-tight">
                        <h2 className="hidden text-base font-bold sm:block">
                            High Point Tech
                        </h2>

                        <p className="hidden text-xs text-muted-foreground sm:block">
                            Cameras • Drones • Repairs
                        </p>

                        <span className="text-lg font-bold sm:hidden">
                            HPT
                        </span>
                    </div>
                </Link>

                {/* ================= DESKTOP NAV ================= */}

                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "group relative py-2 text-sm font-medium transition-colors duration-300",
                                pathname === link.href
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {link.label}

                            <span
                                className={cn(
                                    "absolute -bottom-1 left-0 h-[2px] rounded-full bg-primary transition-all duration-300",
                                    pathname === link.href
                                        ? "w-full"
                                        : "w-0 group-hover:w-full"
                                )}
                            />
                        </Link>
                    ))}
                </nav>

                {/* ================= DESKTOP ACTIONS ================= */}

                <div className="hidden md:flex items-center gap-3">
                    <CartSheet />
                </div>

                {/* ================= MOBILE ACTIONS ================= */}

                <div className="flex items-center gap-2 md:hidden">

                    {/* Cart */}

                    <div className="rounded-full border border-border bg-muted/40 p-1 shadow-sm">
                        <CartSheet />
                    </div>

                    {/* Menu */}

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger
                            className="h-11 w-11 rounded-full border border-border bg-muted/40 shadow-sm transition-all hover:bg-primary hover:text-primary-foreground"
                        >
                            <Menu className="h-5 w-5" />
                        </SheetTrigger>

                        <SheetContent
                            side="right"
                            className="w-[340px] p-0"
                        >
                            <div className="flex h-full flex-col">

                                {/* Header */}

                                <div className="border-b px-6 py-6">

                                    <SheetTitle className="flex items-center gap-4">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                                            <Camera className="h-6 w-6 text-primary" />
                                        </div>

                                        <div>

                                            <h2 className="text-lg font-bold">
                                                High Point Tech
                                            </h2>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Cameras • Drones • Repairs
                                            </p>

                                        </div>

                                    </SheetTitle>

                                </div>

                                {/* Navigation */}

                                <nav className="flex-1 space-y-2 p-5">

                                    {navLinks.map((link) => {
                                        const Icon = link.icon

                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() =>
                                                    setIsOpen(false)
                                                }
                                                className={cn(
                                                    "flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-300",
                                                    pathname === link.href
                                                        ? "bg-primary text-primary-foreground shadow-lg"
                                                        : "hover:bg-muted"
                                                )}
                                            >
                                                <Icon className="h-5 w-5" />

                                                <span className="font-medium">
                                                    {link.label}
                                                </span>
                                            </Link>
                                        )
                                    })}
                                </nav>

                                {/* Bottom CTA */}

                                <div className="border-t p-5">

                                    <Link
                                        href="/services/request"
                                        onClick={() =>
                                            setIsOpen(false)
                                        }
                                        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90"
                                    >
                                        <Wrench className="h-4 w-4" />

                                        Book Camera Repair
                                    </Link>

                                    <p className="mt-5 text-center text-xs text-muted-foreground">
                                        Professional camera sales, repairs &
                                        drone services.
                                    </p>

                                </div>

                            </div>
                        </SheetContent>
                    </Sheet>

                </div>
            </div>
        </header>
    )
}
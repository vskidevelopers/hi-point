// src/components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Camera, Wrench } from 'lucide-react'
import { useState } from 'react'
import { CartSheet } from '@/components/cart/CartSheet'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/services', label: 'Services' },
    { href: '/services/request', label: 'Book Repair' },
    { href: '/track', label: 'Track Order' },
]

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo / Brand */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Camera className="h-6 w-6 text-primary" />
                    <span className="hidden sm:inline-block">High Point Tech</span>
                    <span className="sm:hidden">HPT</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions (Cart) */}
                <div className="hidden md:flex items-center gap-2">
                    <CartSheet />
                </div>

                {/* Mobile Navigation (Hamburger) */}
                <div className="flex items-center gap-2 md:hidden">
                    <CartSheet />
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <SheetTitle className="text-left text-lg font-bold mb-6 flex items-center gap-2">
                                <Camera className="h-5 w-5 text-primary" /> Menu
                            </SheetTitle>
                            <nav className="flex flex-col space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "text-base font-medium transition-colors hover:text-primary py-2 border-b",
                                            pathname === link.href ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Link
                                    href="/services/request"
                                    onClick={() => setIsOpen(false)}
                                    className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-center font-medium"
                                >
                                    <Wrench className="inline-block mr-2 h-4 w-4" />
                                    Book a Repair
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
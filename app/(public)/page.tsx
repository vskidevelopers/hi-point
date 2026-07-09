// src/app/(public)/page.tsx
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Camera,
    Wrench,
    ShoppingBag,
    Shield,
    Zap,
    Clock,
    Award,
    Users,
    ArrowRight,
    CheckCircle2,
    Phone,
    MapPin
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { DISPLAY_PHONE, LOCATION } from '@/lib/constants'

export default async function HomePage() {
    const supabase = await createClient()

    // Fetch featured products (first 4)
    const { data: featuredProducts } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false })
        .limit(4)

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
                <div className="container mx-auto px-4 py-20 md:py-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                                <Award className="h-4 w-4" />
                                East Africa&apos;s Trusted Imaging Experts
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                                Precision. Performance.{' '}
                                <span className="text-primary">Reliability.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Your one-stop destination for professional cameras, drones, and imaging equipment.
                                Expert sales, repairs, and technical support in Nairobi CBD.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/products"
                                    className={buttonVariants({ variant: 'default', size: 'lg', className: 'text-base' })}
                                >
                                    <ShoppingBag className="mr-2 h-5 w-5" />
                                    Shop Products
                                </Link>
                                <Link
                                    href="/services/request"
                                    className={buttonVariants({ variant: 'outline', size: 'lg', className: 'text-base' })}
                                >
                                    <Wrench className="mr-2 h-5 w-5" />
                                    Book a Repair
                                </Link>
                            </div>

                            <div className="flex items-center gap-6 pt-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Genuine Products
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Expert Technicians
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Fast Turnaround
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                <Camera className="h-48 w-48 text-primary/30" />
                            </div>
                            {/* Floating cards */}
                            <div className="absolute -top-4 -right-4 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-3">
                                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">30-Day Warranty</p>
                                    <p className="text-xs text-muted-foreground">On all repairs</p>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-3">
                                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Fast Diagnostics</p>
                                    <p className="text-xs text-muted-foreground">Same-day service</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Imaging Solutions</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            From sales to repairs, we provide end-to-end support for all your imaging technology needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: ShoppingBag,
                                title: 'Product Sales',
                                description: 'Genuine cameras, drones, lenses, and accessories from trusted brands.',
                                color: 'bg-blue-100 dark:bg-blue-900',
                                iconColor: 'text-blue-600 dark:text-blue-400',
                                href: '/products'
                            },
                            {
                                icon: Wrench,
                                title: 'Expert Repairs',
                                description: 'Professional diagnostics and repair services for cameras and drones.',
                                color: 'bg-green-100 dark:bg-green-900',
                                iconColor: 'text-green-600 dark:text-green-400',
                                href: '/services/request'
                            },
                            {
                                icon: Zap,
                                title: 'Technical Support',
                                description: 'Consultation, troubleshooting, and maintenance advice from experts.',
                                color: 'bg-purple-100 dark:bg-purple-900',
                                iconColor: 'text-purple-600 dark:text-purple-400',
                                href: '/services'
                            },
                            {
                                icon: Shield,
                                title: 'Genuine Parts',
                                description: 'Quality replacement parts and accessories with warranty.',
                                color: 'bg-orange-100 dark:bg-orange-900',
                                iconColor: 'text-orange-600 dark:text-orange-400',
                                href: '/products'
                            }
                        ].map((service, index) => {
                            const Icon = service.icon
                            return (
                                <Card key={index} className="group hover:shadow-lg transition-all hover:-translate-y-1">
                                    <CardContent className="pt-6">
                                        <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <Icon className={`h-6 w-6 ${service.iconColor}`} />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                                        <p className="text-muted-foreground mb-4">{service.description}</p>
                                        <Link
                                            href={service.href}
                                            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                                        >
                                            Learn more <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
                            <p className="text-muted-foreground">Explore our latest cameras, drones, and accessories.</p>
                        </div>
                        <Link href="/products">
                            <Button variant="outline" className="inline-flex items-center">
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts?.map((product) => (
                            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all">
                                <div className="aspect-square bg-muted relative overflow-hidden">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Camera className="h-16 w-16 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>
                                <CardContent className="pt-4">
                                    <p className="text-xs text-muted-foreground uppercase mb-1">
                                        {product.categories?.name || 'Product'}
                                    </p>
                                    <h3 className="font-semibold mb-2 line-clamp-1">{product.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-bold text-primary">
                                            KES {product.base_price.toLocaleString()}
                                        </p>
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className={buttonVariants({
                                                variant: product.is_inquiry_only ? 'outline' : 'default',
                                                size: 'sm'
                                            })}
                                        >
                                            {product.is_inquiry_only ? 'Inquire' : 'View'}
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose High Point Technologies?</h2>
                        <p className="text-lg opacity-90 max-w-2xl mx-auto">
                            We&apos;re not just a shop — we&apos;re your trusted partner in imaging technology.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Award,
                                title: 'Expert Technicians',
                                description: 'Highly experienced professionals with practical expertise in diagnosing and repairing cameras and drones.'
                            },
                            {
                                icon: Shield,
                                title: 'Genuine Products',
                                description: 'Quality accessories, replacement parts, and equipment sourced from trusted manufacturers.'
                            },
                            {
                                icon: Users,
                                title: 'Customer-Centered',
                                description: 'Professional consultation, honest recommendations, and dependable after-sales support.'
                            }
                        ].map((item, index) => {
                            const Icon = item.icon
                            return (
                                <div key={index} className="text-center">
                                    <div className="bg-primary-foreground/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="opacity-90">{item.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                                <p className="text-lg text-muted-foreground mb-6">
                                    Whether you need to purchase new equipment or repair your existing gear, we&apos;re here to help.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg">
                                        <Link href="/services/request" className="flex items-center">
                                            <Wrench className="mr-2 h-5 w-5" />
                                            Book a Repair
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg">
                                        <a href={`tel:${DISPLAY_PHONE.replace(/\s/g, '')}`} className="flex items-center">
                                            <Phone className="mr-2 h-5 w-5" />
                                            Call Us Now
                                        </a>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-background p-6 rounded-xl shadow-lg">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <MapPin className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">Visit Our Shop</p>
                                    <p className="text-sm text-muted-foreground">{LOCATION.address}</p>
                                    <p className="text-sm text-muted-foreground">Mon-Sat: 8AM - 6PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
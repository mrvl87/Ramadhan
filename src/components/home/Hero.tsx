"use client";

import Link from "next/link";
import { ArrowRight, Camera, ChefHat, Gift, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeometricPattern } from "@/components/ui/geometric-pattern";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { landingContent } from "@/config/landing-content";
import { motion } from "framer-motion";

const iconMap: Record<string, LucideIcon> = {
    Camera,
    ChefHat,
    Gift,
};

export function Hero() {
    const { hero } = landingContent;

    return (
        <section className="relative min-h-[600px] flex items-center overflow-hidden bg-gradient-to-br from-teal-900 to-slate-950 text-white pt-20 pb-16 md:pt-24 md:pb-24">

            {/* Background Elements */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <GeometricPattern className="text-teal-200" />
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -z-10" />

            <div className="container px-4 md:px-6 relative z-10 mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Copy */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm font-medium backdrop-blur-sm"
                        >
                            {hero.badge}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-balance"
                        >
                            <span className="bg-gradient-to-r from-white via-teal-50 to-teal-100 bg-clip-text text-transparent">
                                {hero.headline}
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed text-balance"
                        >
                            {hero.subheadline}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                        >
                            <Link href={hero.ctaPrimary.href} className="w-full sm:w-auto">
                                <Button size="xl" variant="gold" className="w-full sm:w-auto rounded-full font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all">
                                    {hero.ctaPrimary.text}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href={hero.ctaSecondary.href} className="w-full sm:w-auto">
                                <Button size="xl" variant="outline" className="w-full sm:w-auto rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all">
                                    {hero.ctaSecondary.text}
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Column: Visuals (Carousel) */}
                    <div className="relative h-[400px] lg:h-[600px] hidden lg:flex items-center justify-center w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
                            animate={{ opacity: 1, scale: 1, rotateY: -6 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            style={{ perspective: 1000 }}
                            className="relative w-full max-w-lg aspect-[4/3] rounded-3xl p-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 shadow-2xl"
                        >
                            <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                <HeroCarousel images={hero.carouselImages || []} />

                                {/* Decorative Floating Elements */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -right-8 top-10 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-xl"
                                >
                                    <Camera className="w-6 h-6 text-teal-400" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -left-8 bottom-20 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-xl"
                                >
                                    <ChefHat className="w-6 h-6 text-amber-400" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

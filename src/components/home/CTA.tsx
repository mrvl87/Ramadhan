"use client";

import { landingContent } from "@/config/landing-content";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GeometricPattern } from "@/components/ui/geometric-pattern";
import { motion } from "framer-motion";

export function CTA() {
    const { cta } = landingContent;
    if (!cta) return null;

    return (
        <section className="py-24 px-4">
            <div className="container mx-auto">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-600 to-teal-900 shadow-2xl">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <GeometricPattern />
                    </div>

                    {/* Glows */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 py-16 px-6 md:px-12 text-center max-w-4xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold text-white mb-6"
                        >
                            {cta.title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-xl text-teal-100 mb-8 max-w-2xl mx-auto"
                        >
                            {cta.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link href={cta.href}>
                                <Button size="xl" variant="gold" className="rounded-full px-12 text-lg font-bold shadow-xl shadow-amber-900/20 hover:shadow-amber-900/40 hover:scale-105 transition-all">
                                    {cta.buttonText}
                                    <ArrowRight className="ml-2 w-6 h-6" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

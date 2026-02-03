"use client";

import { landingContent } from "@/config/landing-content";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function Features() {
    const { features, hero } = landingContent;

    return (
        <section id="features" className="py-24 bg-background relative">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{features.title}</h2>
                    <p className="text-muted-foreground text-lg">{features.subtitle}</p>
                </div>

                <div className="space-y-24">
                    {features.items.map((feature, index) => {
                        const isEven = index % 2 === 0;
                        const imageUrl = hero.carouselImages[feature.imageIndex];

                        return (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7 }}
                                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                            >
                                {/* Visual Side */}
                                <div className="flex-1 w-full">
                                    <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-30 mix-blend-overlay z-10`} />
                                        <Image
                                            src={imageUrl}
                                            alt={feature.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Overlay for depth */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    <div className="pt-4">
                                        <Link href={feature.href}>
                                            <Button variant="gold" size="lg" className="rounded-full px-8 shadow-lg shadow-amber-500/10">
                                                {feature.cta}
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

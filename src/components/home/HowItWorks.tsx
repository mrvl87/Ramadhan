"use client";

import { landingContent } from "@/config/landing-content";
import { LayoutDashboard, Sparkles, Share2, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    Sparkles,
    Share2,
};

export function HowItWorks() {
    const { howItWorks } = landingContent;

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-50">
                <div className="absolute top-1/4 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-400 dark:to-teal-200 bg-clip-text text-transparent mb-4">
                        {howItWorks.title}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {howItWorks.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">

                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-teal-200/0 via-teal-200 to-teal-200/0 dark:from-teal-800/0 dark:via-teal-800 dark:to-teal-800/0 z-0" />

                    {howItWorks.steps.map((step, index) => {
                        const Icon = iconMap[step.icon];

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center group"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-teal-900/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-100 dark:border-slate-700">
                                    {Icon && <Icon className="w-8 h-8 text-teal-600 dark:text-teal-400" />}
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                                    {step.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                                    {step.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

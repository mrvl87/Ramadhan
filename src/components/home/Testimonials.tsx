"use client";

import { landingContent } from "@/config/landing-content";
import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export function Testimonials() {
    const { testimonials } = landingContent;

    // Safety check
    if (!testimonials) return null;

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-4">
                        {testimonials.title}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {testimonials.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col h-full"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                                    />
                                ))}
                            </div>

                            <p className="text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed flex-grow">
                                "{item.content}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                                    <Image
                                        src={item.avatar}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

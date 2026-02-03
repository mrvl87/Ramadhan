"use client";

import { landingContent } from "@/config/landing-content";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
    const { faq } = landingContent;
    if (!faq) return null;

    return (
        <section className="py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                        {faq.title}
                    </h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faq.items.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg font-medium text-slate-800 dark:text-slate-200">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}

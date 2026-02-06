"use client";

import { useState } from "react";
import {
    Calendar,
    ShoppingCart,
    ChevronDown,
    ChevronUp,
    ChefHat,
    CheckCircle2,
    Clock,
    Flame,
    UtensilsCrossed,
    Apple
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface DayMenu {
    day: number;
    suhoor: { dish: string; recipe: string; nutrients: string };
    takjil: { dish: string };
    iftar: { dish: string; recipe: string; nutrients: string };
}

interface MenuContent {
    title: string;
    menu: DayMenu[];
    shopping_list: {
        produce: string[];
        protein: string[];
        pantry: string[];
    };
}

export function MenuResult({ data }: { data: MenuContent }) {
    const [expandedDay, setExpandedDay] = useState<number | null>(1);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{data.title}</h2>
                    <p className="text-sm text-slate-500">Your personalized Ramadan roadmap</p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {data.menu.length} Days
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="plan" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <TabsTrigger value="plan" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Weekly Plan
                    </TabsTrigger>
                    <TabsTrigger value="shopping" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Shopping List
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="plan" className="space-y-4 outline-none">
                    {data.menu.map((day) => (
                        <div
                            key={day.day}
                            className={`border rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-slate-900 ${expandedDay === day.day ? 'ring-2 ring-orange-500/20 border-orange-200' : 'border-slate-200'
                                }`}
                        >
                            <button
                                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${expandedDay === day.day ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                        }`}>
                                        {day.day}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">Day {day.day} Overview</h3>
                                        <p className="text-xs text-slate-500 truncate max-w-[200px] md:max-w-md">
                                            {day.iftar.dish}
                                        </p>
                                    </div>
                                </div>
                                {expandedDay === day.day ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>

                            <AnimatePresence>
                                {expandedDay === day.day && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 pt-2 grid md:grid-cols-3 gap-6 border-t border-slate-100 dark:border-slate-800">
                                            {/* Suhoor */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider">
                                                    <Clock className="w-4 h-4" /> Suhoor
                                                </div>
                                                <div className="p-3 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/50">
                                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{day.suhoor.dish}</h4>
                                                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-2">{day.suhoor.recipe}</p>
                                                    <Badge variant="secondary" className="text-[10px] bg-indigo-100 text-indigo-700 border-none font-medium">
                                                        {day.suhoor.nutrients}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Takjil */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm uppercase tracking-wider">
                                                    <Apple className="w-4 h-4" /> Takjil
                                                </div>
                                                <div className="p-3 bg-amber-50/30 dark:bg-amber-950/20 rounded-xl border border-amber-100/50">
                                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{day.takjil.dish}</h4>
                                                    <p className="text-xs text-slate-600 dark:text-gray-400 italic">Sweet starter before main Iftar</p>
                                                </div>
                                            </div>

                                            {/* Iftar */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm uppercase tracking-wider">
                                                    <UtensilsCrossed className="w-4 h-4" /> Iftar (Main)
                                                </div>
                                                <div className="p-3 bg-orange-50/30 dark:bg-orange-950/20 rounded-xl border border-orange-100/50">
                                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{day.iftar.dish}</h4>
                                                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-2">{day.iftar.recipe}</p>
                                                    <Badge variant="secondary" className="text-[10px] bg-orange-100 text-orange-700 border-none font-medium">
                                                        {day.iftar.nutrients}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </TabsContent>

                <TabsContent value="shopping" className="outline-none">
                    <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(data.shopping_list).map(([category, items]) => (
                            <div key={category} className="bg-white dark:bg-slate-900 border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg capitalize mb-4 flex items-center">
                                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-3">
                                        <CheckCircle2 className="w-5 h-5 text-orange-600" />
                                    </div>
                                    {category}
                                </h3>
                                <ul className="space-y-2">
                                    {(items as string[]).map((item, idx) => (
                                        <li key={idx} className="flex items-center text-sm text-slate-600 dark:text-gray-400 group cursor-pointer">
                                            <div className="w-5 h-5 rounded border border-slate-300 mr-3 group-hover:border-orange-500 transition-colors flex items-center justify-center">
                                                {/* Hidden checkmark that appears on click in real app logic, placeholder here */}
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

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
    suhoor: string;
    takjil: string;
    iftar: string;
    calories: string;
    protein: string;
}

interface MenuData {
    menu: DayMenu[];
    shopping_list: string[];
}

export function MenuResult({ data }: { data: MenuData }) {
    const [expandedDay, setExpandedDay] = useState<number | null>(1);

    if (!data || !data.menu) return null;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
                        Rencana Menu Ramadhan Anda
                    </h2>
                    <p className="text-sm text-slate-500">Panduan nutrisi harian untuk ibadah yang maksimal</p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800 px-3 py-1">
                        {data.menu.length} Hari
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="plan" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl h-14">
                    <TabsTrigger value="plan" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm gap-2 text-base">
                        <Calendar className="w-5 h-5" />
                        Rencana Harian
                    </TabsTrigger>
                    <TabsTrigger value="shopping" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm gap-2 text-base">
                        <ShoppingCart className="w-5 h-5" />
                        Daftar Belanja
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="plan" className="space-y-4">
                    {data.menu.map((day) => (
                        <div
                            key={day.day}
                            className={`group border rounded-3xl transition-all duration-300 overflow-hidden bg-white dark:bg-slate-900 ${expandedDay === day.day
                                    ? 'border-emerald-200 dark:border-emerald-800 shadow-md ring-1 ring-emerald-50 dark:ring-emerald-900/20'
                                    : 'border-slate-100 dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-900'
                                }`}
                        >
                            <button
                                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                                className="w-full p-5 flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-colors ${expandedDay === day.day
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900 group-hover:text-emerald-600'
                                        }`}>
                                        {day.day}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white">Hari ke-{day.day} Ramadhan</div>
                                        <div className="flex gap-3 mt-1">
                                            <span className="text-[11px] flex items-center gap-1 text-slate-500 uppercase tracking-wider font-bold">
                                                <Flame className="w-3 h-3 text-orange-500" /> {day.calories}
                                            </span>
                                            <span className="text-[11px] flex items-center gap-1 text-slate-500 uppercase tracking-wider font-bold">
                                                <Apple className="w-3 h-3 text-emerald-500" /> {day.protein}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {expandedDay === day.day ? (
                                    <ChevronUp className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                            </button>

                            <AnimatePresence>
                                {expandedDay === day.day && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-5 pb-6 grid md:grid-cols-3 gap-4 border-t border-slate-50 dark:border-slate-800/50 pt-5">
                                            {/* Suhoor */}
                                            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-900/20 border border-teal-100/50 dark:border-teal-800/30 space-y-3">
                                                <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-sm uppercase tracking-wide">
                                                    <Clock className="w-4 h-4" /> Sahur
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                                                    {day.suhoor}
                                                </p>
                                            </div>

                                            {/* Takjil */}
                                            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100/50 dark:border-amber-800/30 space-y-3">
                                                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm uppercase tracking-wide">
                                                    <Apple className="w-4 h-4" /> Takjil
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                                                    {day.takjil}
                                                </p>
                                            </div>

                                            {/* Iftar */}
                                            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/30 space-y-3">
                                                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm uppercase tracking-wide">
                                                    <ChefHat className="w-4 h-4" /> Buka Puasa
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                                                    {day.iftar}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </TabsContent>

                <TabsContent value="shopping">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Daftar Belanja Bahan</h3>
                                <p className="text-xs text-slate-500">Semua yang Anda butuhkan untuk menu harian</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                            {data.shopping_list.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:translate-x-1">
                                    <div className="mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

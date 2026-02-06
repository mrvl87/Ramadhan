"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreditExhaustedModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreditExhaustedModal({ isOpen, onClose }: CreditExhaustedModalProps) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen) {
            setCountdown(5);
            timer = setInterval(() => {
                setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && countdown === 0) {
            router.push("/pricing");
        }
    }, [isOpen, countdown, router]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] p-0 overflow-hidden border-none bg-white dark:bg-slate-900 shadow-2xl">
                <div className="relative p-8 text-center space-y-6">
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-50 to-transparent dark:from-amber-950/20 -z-10" />

                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
                                <Coins className="w-10 h-10 text-amber-600" />
                            </div>
                            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-500 animate-pulse" />
                        </div>
                    </div>

                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white">
                            Saldo Kredit Habis
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                            Maaf, Anda telah mencapai batas kreasi harian. Tingkatkan paket Anda untuk terus merencanakan Ramadan yang sempurna.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Mengarahkan otomatis dalam <span className="text-amber-600 font-bold">{countdown}</span> detik...
                        </p>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-xl border-slate-200 dark:border-slate-800"
                        >
                            Tutup
                        </Button>
                        <Button
                            onClick={() => router.push("/pricing")}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-lg shadow-amber-600/20"
                        >
                            Pilih Paket <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

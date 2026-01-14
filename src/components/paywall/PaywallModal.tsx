"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { UpgradeCard } from "./UpgradeCard"

interface PaywallModalProps {
    isOpen: boolean
    onClose: () => void
    reason?: "NO_CREDITS" | "NOT_LOGGED_IN" | string
}

export function PaywallModal({ isOpen, onClose, reason }: PaywallModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            // Call API (Xendit Only)
            const res = await fetch("/api/payment/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}) // No country code needed anymore
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error("Server Error: " + text);
            }

            const data = await res.json();

            if (data.url) {
                // Redirect to Xendit Invoice
                window.location.href = data.url;
            } else {
                throw new Error(data.error || "No URL returned");
            }
        } catch (error: any) {
            console.error(error);
            alert("Payment Error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-transparent border-none shadow-none">
                <div className="bg-background rounded-lg shadow-lg border">
                    {/* 
              We use a clean header or hide it if the UpgradeCard handles the visuals.
              For accessibility, strictly we should have DialogTitle.
            */}
                    <DialogHeader className="sr-only">
                        <DialogTitle>Upgrade to Pro</DialogTitle>
                        <DialogDescription>
                            {reason === "NOT_LOGGED_IN" ? "Please log in to continue." : "You have run out of credits."}
                        </DialogDescription>
                    </DialogHeader>
                    <UpgradeCard onUpgrade={handleUpgrade} isLoading={isLoading} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

"use client"

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
                    <UpgradeCard />
                </div>
            </DialogContent>
        </Dialog>
    )
}

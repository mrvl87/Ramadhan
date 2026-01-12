import { useState } from "react"

export type GatekeeperResponse = {
    status: string
    reason?: string
    upgrade_url?: string
    // Success data
    data?: any
}

export function usePaywall() {
    const [isPaywallOpen, setPaywallOpen] = useState(false)
    const [paywallReason, setPaywallReason] = useState<string>("NO_CREDITS")

    /**
     * Checks an API response for the "PAYWALL" status.
     * Returns true if the user is blocked (and opens the modal).
     * Returns false if the request was successful/allowed.
     */
    const interceptResponse = async (response: Response): Promise<boolean> => {
        if (response.status === 403 || response.status === 402) {
            try {
                // Clone response to not consume the body for the caller if needed
                // But usually if it's 403 we consume it here.
                const data = await response.clone().json()
                if (data.status === "PAYWALL") {
                    setPaywallReason(data.reason || "NO_CREDITS")
                    setPaywallOpen(true)
                    return true // BLOCKED
                }
            } catch (e) {
                // Not JSON or other error, ignore
            }
        }
        return false // ALLOWED (or different error)
    }

    return {
        isPaywallOpen,
        paywallReason,
        setPaywallOpen,
        interceptResponse
    }
}

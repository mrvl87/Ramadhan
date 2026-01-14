import { Check, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface UpgradeCardProps {
    onUpgrade?: () => void
    isLoading?: boolean
}

export function UpgradeCard({ onUpgrade, isLoading }: UpgradeCardProps) {
    return (
        <Card className="w-full border-green-500/20 bg-gradient-to-b from-green-50/50 to-transparent dark:from-green-950/20">
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    Unlock Ramadan Pro
                </CardTitle>
                <CardDescription>
                    Your Ramadan card deserves to be beautiful. Remove limits and watermarks.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="grid gap-0.5">
                        <h4 className="font-semibold">Unlimited AI Generation</h4>
                        <div className="text-sm text-muted-foreground">Create as many cards, menus, and gifts as you need.</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="grid gap-0.5">
                        <h4 className="font-semibold">No Watermarks</h4>
                        <div className="text-sm text-muted-foreground">Share pristine, professional-quality images.</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="grid gap-0.5">
                        <h4 className="font-semibold">HD Downloads</h4>
                        <div className="text-sm text-muted-foreground">Get the highest resolution for printing.</div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                    onClick={onUpgrade}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Upgrade to Pro"}
                </Button>
                <div className="text-xs text-center text-muted-foreground">
                    Or <span className="underline cursor-pointer">buy credit pack</span>
                </div>
            </CardFooter>
        </Card>
    )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/30 to-background p-4">
            <Card className="w-full max-w-md shadow-warm-lg border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-xl font-bold text-red-600 dark:text-red-400">
                        Authentication Error
                    </CardTitle>
                    <CardDescription>
                        We encountered an issue verifying your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-sm text-balance">
                        This link may have expired or is invalid. Please try requesting a new one.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Link href="/login" className="w-full">
                        <Button className="w-full">Back to Login</Button>
                    </Link>
                    <Link href="/forgot-password" className="w-full">
                        <Button variant="outline" className="w-full">Request New Link</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

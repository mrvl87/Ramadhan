'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function AuthErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const errorCode = searchParams.get('error_code')
    const errorDescription = searchParams.get('error_description')

    return (
        <Card className="w-full max-w-md border-red-200 dark:border-red-900">
            <CardHeader>
                <CardTitle className="text-red-500 text-center">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                    <p className="font-semibold text-lg">{errorCode || error || 'Unknown Error'}</p>
                    <p className="text-muted-foreground">{errorDescription || 'An unexpected error occurred during authentication.'}</p>
                </div>

                <div className="pt-4">
                    <Link href="/login">
                        <Button className="w-full" variant="outline">Back to Login</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default function AuthErrorPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-neutral-950">
            <Suspense fallback={<div>Loading error details...</div>}>
                <AuthErrorContent />
            </Suspense>
        </div>
    )
}

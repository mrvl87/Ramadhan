"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Loader2, Eye, EyeOff, RefreshCw } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignUpPage() {
    const router = useRouter()
    const supabase = createClient()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("")

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [successMode, setSuccessMode] = useState(false)

    // Password Strength Logic
    const [strength, setStrength] = useState(0)
    const [strengthText, setStrengthText] = useState("")

    useEffect(() => {
        let score = 0
        if (password.length > 0) {
            if (password.length >= 8) score += 20
            if (/[A-Z]/.test(password)) score += 20
            if (/[a-z]/.test(password)) score += 20
            if (/[0-9]/.test(password)) score += 20
            if (/[^A-Za-z0-9]/.test(password)) score += 20
        }
        setStrength(score)
        if (score === 0) setStrengthText("")
        else if (score <= 40) setStrengthText("Weak")
        else if (score <= 80) setStrengthText("Medium")
        else setStrengthText("Strong")
    }, [password])

    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
        let newPassword = ""
        for (let i = 0, n = charset.length; i < 12; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * n))
        }
        setPassword(newPassword)
        // Ensure show password is on so user can see it
        setShowPassword(true)
    }

    const getStrengthColor = (score: number) => {
        if (score <= 40) return "bg-red-500"
        if (score <= 80) return "bg-yellow-500"
        return "bg-green-500"
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (strength < 60) {
            toast.error("Please use a stronger password")
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        full_name: fullName,
                        age: parseInt(age),
                        gender: gender,
                    },
                },
            })

            if (error) throw error

            setSuccessMode(true)
            toast.success("Account created successfully!")
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (successMode) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/30 to-background p-4">
                <Card className="w-full max-w-md shadow-warm-lg border-0 bg-card/95 backdrop-blur-sm">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Check your email</CardTitle>
                        <CardDescription>
                            We've sent a confirmation link to <span className="font-semibold text-foreground">{email}</span>. Please click the link to activate your account.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col gap-2">
                        <Link href="/login" className="w-full">
                            <Button variant="outline" className="w-full">Back to Login</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/30 to-background p-4">
            <Card className="w-full max-w-md shadow-warm-lg border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">
                        Create an Account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Join RamadanHub AI to start your spiritual journey
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <form onSubmit={handleSignUp} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                placeholder="e.g. Ahmad Fulan"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="25"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    disabled={loading}
                                    required
                                    min={13}
                                    max={100}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={gender} onValueChange={setGender} required disabled={loading}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <button
                                    type="button"
                                    onClick={generatePassword}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    Generate Strong Password
                                </button>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                    className="pr-10"
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {/* Strength Indicator */}
                            {password.length > 0 && (
                                <div className="space-y-1">
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
                                            style={{ width: `${strength}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className={
                                            strength <= 40 ? "text-red-500" :
                                                strength <= 80 ? "text-yellow-500" :
                                                    "text-green-500"
                                        }>
                                            {strengthText}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {password.length} chars
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

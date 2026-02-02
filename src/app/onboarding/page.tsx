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
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User } from "lucide-react"
import { toast } from "sonner"

export default function OnboardingPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    // Form state
    const [fullName, setFullName] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("")

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login")
                return
            }
            setUserId(user.id)

            // Check if profile is already complete
            const { data: profile } = await supabase
                .from("users")
                .select("full_name")
                .eq("id", user.id)
                .single()

            if (profile?.full_name) {
                router.push("/")
            }
        }
        checkUser()
    }, [router, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userId) return

        setLoading(true)

        try {
            const { error } = await supabase
                .from("users")
                .update({
                    full_name: fullName,
                    age: parseInt(age),
                    gender: gender
                })
                .eq("id", userId)

            if (error) throw error

            toast.success("Profile updated successfully!")
            router.push("/")
            router.refresh()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!userId) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/30 to-background p-4">
            <Card className="w-full max-w-md shadow-warm-lg border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-2">
                        <User className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Welcome to RamadanHub AI
                    </CardTitle>
                    <CardDescription>
                        Please complete your profile to get a personalized experience.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
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
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="e.g. 25"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    disabled={loading}
                                    required
                                    min={13}
                                    max={100}
                                />
                            </div>
                            <div className="space-y-2">
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

                        <Button className="w-full mt-4" type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Complete Profile
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

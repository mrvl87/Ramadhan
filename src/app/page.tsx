'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ChefHat, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  useEffect(() => {
    // Check for payment success using URLSearchParams (client-side only)
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      toast.success('🎉 Payment successful! Your Pro subscription is now active.', {
        duration: 5000,
      });

      // Clean URL without reload
      window.history.replaceState({}, '', '/');
    }
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Gradient from teal to deep navy */}
      <section className="relative min-h-[520px] flex items-center justify-center text-center px-4 overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 dark:from-slate-900 dark:via-teal-900 dark:to-slate-950">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-40 right-1/4 w-32 h-32 bg-amber-300/5 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-amber-200 text-sm font-medium">
            ✨ AI-Powered Ramadan Companion
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Make Ramadan<br />
            <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">More Meaningful</span>
          </h1>
          <p className="text-xl text-teal-100/90 max-w-xl mx-auto leading-relaxed">
            AI-powered tools for your family photos, meal planning, and gift ideas. Celebrate with purpose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button variant="gold" size="xl" className="rounded-full min-w-[180px]">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="xl" className="rounded-full min-w-[180px] bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three powerful AI tools to enhance your Ramadan experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Family Photo */}
          <Card className="animate-fade-in-up stagger-1 overflow-hidden group border-0 bg-gradient-to-b from-card to-accent/30 dark:from-card dark:to-accent/10">
            <div className="h-48 bg-gradient-to-br from-teal-500/10 to-teal-600/20 dark:from-teal-500/20 dark:to-teal-600/30 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
              <Camera className="w-16 h-16 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform relative z-10" />
            </div>
            <CardHeader>
              <CardTitle className="text-foreground group-hover:text-primary transition-colors">AI Family Photo</CardTitle>
              <CardDescription>Turn selfies into beautiful Eid family portraits.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/kartu/family" className="w-full">
                <Button variant="teal" className="w-full group-hover:shadow-glow-teal transition-shadow">
                  Create Photo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Menu Generator */}
          <Card className="animate-fade-in-up stagger-2 overflow-hidden group border-0 bg-gradient-to-b from-card to-accent/30 dark:from-card dark:to-accent/10">
            <div className="h-48 bg-gradient-to-br from-amber-500/10 to-amber-600/20 dark:from-amber-500/20 dark:to-amber-600/30 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
              <ChefHat className="w-16 h-16 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform relative z-10" />
            </div>
            <CardHeader>
              <CardTitle className="text-foreground group-hover:text-primary transition-colors">Menu Planner</CardTitle>
              <CardDescription>Get a personalized Iftar & Sahur meal plan.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/menu" className="w-full">
                <Button variant="gold" className="w-full group-hover:shadow-glow-gold transition-shadow">
                  Plan Menu <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Gift Recommendation */}
          <Card className="animate-fade-in-up stagger-3 overflow-hidden group border-0 bg-gradient-to-b from-card to-accent/30 dark:from-card dark:to-accent/10">
            <div className="h-48 bg-gradient-to-br from-teal-500/10 to-teal-600/20 dark:from-teal-500/20 dark:to-teal-600/30 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
              <Gift className="w-16 h-16 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform relative z-10" />
            </div>
            <CardHeader>
              <CardTitle className="text-foreground group-hover:text-primary transition-colors">Gift Ideas</CardTitle>
              <CardDescription>Find thoughtful gifts for your loved ones.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/gift-ideas" className="w-full">
                <Button variant="teal" className="w-full group-hover:shadow-glow-teal transition-shadow">
                  Find Gifts <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🌙</span>
            </div>
            <span className="font-semibold text-white">RamadanHub AI</span>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} RamadanHub AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

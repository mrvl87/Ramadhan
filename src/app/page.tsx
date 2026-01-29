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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="bg-[url('/assets/hero-bg.jpg')] bg-cover bg-center relative h-[500px] flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className="text-5xl font-bold text-white tracking-tight">RamadanHub AI</h1>
          <p className="text-xl text-gray-200">
            Make this Ramadan more meaningful with AI-powered tools for your family, food, and festivities.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Our Features</h2>
        <div className="grid md:grid-cols-3 gap-8">

          {/* Family Photo */}
          <Card className="animate-fade-in-up stagger-1 hover:shadow-xl transition-all border-emerald-100 dark:border-emerald-900 dark:bg-slate-900 overflow-hidden group">
            <div className="h-48 bg-emerald-50 dark:bg-emerald-950 relative flex items-center justify-center">
              <Camera className="w-16 h-16 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <CardHeader>
              <CardTitle className="text-emerald-700 dark:text-emerald-400">AI Family Photo</CardTitle>
              <CardDescription className="dark:text-slate-400">Turn selfies into beautiful Eid family portraits.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/kartu/family" className="w-full">
                <Button variant="outline" className="w-full border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  Create Photo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Menu Generator */}
          <Card className="animate-fade-in-up stagger-2 hover:shadow-xl transition-all border-orange-100 dark:border-orange-900 dark:bg-slate-900 overflow-hidden group">
            <div className="h-48 bg-orange-50 dark:bg-orange-950 relative flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
            </div>
            <CardHeader>
              <CardTitle className="text-orange-700 dark:text-orange-400">Review Menu</CardTitle>
              <CardDescription className="dark:text-slate-400">Get a personalized Iftar & Sahur meal plan.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/menu" className="w-full">
                <Button variant="outline" className="w-full border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  Plan Menu <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Gift Recommendation */}
          <Card className="animate-fade-in-up stagger-3 hover:shadow-xl transition-all border-purple-100 dark:border-purple-900 dark:bg-slate-900 overflow-hidden group">
            <div className="h-48 bg-purple-50 dark:bg-purple-950 relative flex items-center justify-center">
              <Gift className="w-16 h-16 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <CardHeader>
              <CardTitle className="text-purple-700 dark:text-purple-400">Gift Ideas</CardTitle>
              <CardDescription className="dark:text-slate-400">Find thoughtful gifts for your loved ones.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/gift-ideas" className="w-full">
                <Button variant="outline" className="w-full border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  Find Gifts <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <p>&copy; {new Date().getFullYear()} RamadanHub AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

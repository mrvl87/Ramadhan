import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ChefHat, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-[url('/assets/hero-bg.jpg')] bg-cover bg-center relative h-[500px] flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className="text-5xl font-bold text-white tracking-tight">RamadanHub AI</h1>
          <p className="text-xl text-gray-200">
            Make this Ramadan more meaningful with AI-powered tools for your family, food, and festivities.
          </p>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8">
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Features</h2>
        <div className="grid md:grid-cols-3 gap-8">

          {/* Family Photo */}
          <Card className="hover:shadow-xl transition-all border-emerald-100 overflow-hidden group">
            <div className="h-48 bg-emerald-50 relative flex items-center justify-center">
              <Camera className="w-16 h-16 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <CardHeader>
              <CardTitle className=" text-emerald-700">AI Family Photo</CardTitle>
              <CardDescription>Turn selfies into beautiful Eid family portraits.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/kartu/family" className="w-full">
                <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  Create Photo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Menu Generator */}
          <Card className="hover:shadow-xl transition-all border-orange-100 overflow-hidden group">
            <div className="h-48 bg-orange-50 relative flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-orange-600 group-hover:scale-110 transition-transform" />
            </div>
            <CardHeader>
              <CardTitle className="text-orange-700">Review Menu</CardTitle>
              <CardDescription>Get a personalized Iftar & Sahur meal plan.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/menu" className="w-full">
                <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  Plan Menu <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Gift Recommendation */}
          <Card className="hover:shadow-xl transition-all border-purple-100 overflow-hidden group">
            <div className="h-48 bg-purple-50 relative flex items-center justify-center">
              <Gift className="w-16 h-16 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <CardHeader>
              <CardTitle className="text-purple-700">Gift Ideas</CardTitle>
              <CardDescription>Find thoughtful gifts for your loved ones.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/gift" className="w-full">
                <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  Find Gifts <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <p>&copy; 2024 RamadanHub AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

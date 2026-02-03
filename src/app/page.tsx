'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ChefHat, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Features } from "@/components/home/Features";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { CTA } from "@/components/home/CTA";
import { Footer } from "@/components/layout/Footer";

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
      {/* New Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Grid */}
      {/* Features Showcase */}
      <Features />

      {/* Social Proof */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* Final Call to Action */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}

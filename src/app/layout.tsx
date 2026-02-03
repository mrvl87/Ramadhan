import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/toaster";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RamadanHub AI - Bring the Warmth of Ramadan Home",
    template: "%s | RamadanHub AI"
  },
  description: "Experience a meaningful Ramadan with AI. Create studio-quality family photos, plan healthy Sahur & Iftar meals, and find thoughtful gifts in seconds.",
  keywords: ["Ramadan AI", "Muslim Family Photo", "Iftar Menu Planner", "Ramadan 2026", "AI Gift Ideas", "Halal Food Planner"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://ramadhandna.ai",
    siteName: "RamadanHub AI",
    images: [
      {
        url: "/og-ramadan.jpg", // Placeholder for when we have a real OG image
        width: 1200,
        height: 630,
        alt: "RamadanHub AI Homepage"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "RamadanHub AI",
    description: "Bring the warmth of Ramadan home with AI-powered family photos and meal planning.",
    images: ["/og-ramadan.jpg"]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

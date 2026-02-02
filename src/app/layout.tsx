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
    default: "RamadanHub AI - Your AI Companion for Ramadan",
    template: "%s | RamadanHub AI"
  },
  description: "AI-powered tools for family photos, meal planning, and gift recommendations during Ramadan",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://ramadhandna.ai", // Placeholder domain, should be updated with actual
    siteName: "RamadanHub AI",
    images: [
      {
        url: "/og-default.jpg", // We need to make sure this asset exists or is handled
        width: 1200,
        height: 630,
        alt: "RamadanHub AI Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "RamadanHub AI",
    description: "Celebrate Ramadan with AI-powered family photos and more.",
    images: ["/og-default.jpg"]
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

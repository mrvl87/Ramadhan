import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg">🌙</span>
                            </div>
                            <span className="font-bold text-white text-lg">RamadhanHub AI</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-4">
                            Your AI-powered companion for a meaningful and organized Ramadan celebration.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Features</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/kartu/family" className="hover:text-amber-400 transition-colors">Family Photos</Link></li>
                            <li><Link href="/menu" className="hover:text-amber-400 transition-colors">Menu Planner</Link></li>
                            <li><Link href="/gift-ideas" className="hover:text-amber-400 transition-colors">Gift Ideas</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Connect</h4>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                    &copy; {currentYear} RamadanHub AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

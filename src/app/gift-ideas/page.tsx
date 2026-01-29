import { getHeroImages, incrementImageView } from '@/features/gift-ideas/image-actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Heart, Zap, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function GiftIdeasLandingPage() {
    // Fetch emotional hero images
    const { background, moment } = await getHeroImages()

    // Track view if images exist
    if (background) {
        incrementImageView(background.id).catch(console.error)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-cream to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Hero Section - Emotional Hook */}
            <section className="relative overflow-hidden">
                {/* Background Image */}
                {background && (
                    <div className="absolute inset-0 opacity-20">
                        <Image
                            src={background.public_url}
                            alt="Warm Indonesian family moment"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Floating Ramadan Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">🌙</div>
                    <div className="absolute top-40 right-20 text-5xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>✨</div>
                    <div className="absolute bottom-40 left-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🎁</div>
                </div>

                {/* Hero Content */}
                <div className="relative container mx-auto px-4 py-20 md:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Trust Badge */}
                        <Badge className="mb-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 px-4 py-2">
                            <span className="mr-2">🌙</span>
                            Khusus untuk Keluarga Muslim Indonesia
                        </Badge>

                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            Hadiah yang{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                Menyentuh Hati
                            </span>
                            ,<br />
                            Bukan Sekadar Material
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                            AI membantu Anda menemukan hadiah yang akan mereka{' '}
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                kenang selamanya
                            </span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link href="/gift-ideas/create">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all gap-2 group"
                                >
                                    <span>🎁</span>
                                    Temukan Hadiah Sempurna
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950 gap-2"
                            >
                                <span>💭</span>
                                Lihat Contoh Hadiah
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                            <p className="text-sm md:text-base">
                                <span className="font-bold text-purple-600 dark:text-purple-400">1,247 keluarga</span>
                                {' '}telah menemukan hadiah istimewa minggu ini
                            </p>
                        </div>
                    </div>

                    {/* Emotional Moment Image */}
                    {moment && (
                        <div className="mt-16 max-w-3xl mx-auto">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src={moment.public_url}
                                    alt="Momen bahagia berbagi hadiah"
                                    width={moment.width || 1200}
                                    height={moment.height || 675}
                                    className="w-full h-auto"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <p className="text-lg md:text-xl font-semibold italic">
                                        "Bayangkan senyum bahagia mereka saat membuka hadiah sempurna dari Anda..."
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Problem Agitation Section */}
            <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Bingung Mencari Hadiah yang Tepat?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Pain Point 1 */}
                        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700">
                            <div className="text-5xl mb-4">😰</div>
                            <h3 className="text-xl font-bold mb-3">Takut hadiah tidak berkesan</h3>
                            <p className="text-slate-300">
                                Sudah beli mahal tapi hasilnya... biasa saja? Tidak lagi!
                            </p>
                        </div>

                        {/* Pain Point 2 */}
                        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700">
                            <div className="text-5xl mb-4">⏰</div>
                            <h3 className="text-xl font-bold mb-3">Waktu terus berjalan</h3>
                            <p className="text-slate-300">
                                Ramadan tinggal beberapa hari, tapi belum dapat ide sempurna?
                            </p>
                        </div>

                        {/* Pain Point 3 */}
                        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700">
                            <div className="text-5xl mb-4">💸</div>
                            <h3 className="text-xl font-bold mb-3">Budget terbatas, harapan tinggi</h3>
                            <p className="text-slate-300">
                                Ingin hadiah bermakna tanpa menguras kantong? Bisa!
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xl mt-12 text-slate-300">
                        💬 <span className="font-semibold">Kami mengerti...</span> Memberi hadiah itu tentang{' '}
                        <span className="text-pink-400 font-bold">PERASAAN</span>, bukan harga.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
                        Kenapa AI Kami Berbeda?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                                Dipahami AI, Bukan Dicari Manual
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                AI kami memahami hubungan, kepribadian, dan momen spesial Anda
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                                Budaya & Spiritual Indonesia
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Semua rekomendasi halal, Islami, dan sesuai budaya Indonesia
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                                Hasil Instan, Langsung Beli
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                2 menit dapat 5 rekomendasi + link langsung ke toko online
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works - Emotional Journey */}
            <section className="py-20 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-4">
                        3 Langkah Menuju Senyum Bahagia Mereka
                    </h2>
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-16">
                        Bukan sekadar mencari produk, tapi memahami perasaan
                    </p>

                    <div className="max-w-3xl mx-auto space-y-12">
                        {/* Step 1 */}
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                1
                            </div>
                            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                                    Ceritakan Tentang Mereka
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Siapa yang ingin Anda bahagiakan? Apa yang mereka sukai? Kami akan mendengar dengan seksama.
                                </p>
                            </div>
                        </div>

                        {/* Connector */}
                        <div className="flex justify-center">
                            <div className="w-1 h-12 bg-gradient-to-b from-purple-300 to-pink-300 rounded-full" />
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                2
                            </div>
                            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                                    AI Kami Memahami Mereka
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Bukan sekadar mencari produk, tapi memahami PERASAAN. AI terlatih dengan ribuan cerita hadiah sukses.
                                </p>
                            </div>
                        </div>

                        {/* Connector */}
                        <div className="flex justify-center">
                            <div className="w-1 h-12 bg-gradient-to-b from-pink-300 to-orange-300 rounded-full" />
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                3
                            </div>
                            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                                    Temukan Hadiah yang Menyentuh Hati
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    5 rekomendasi yang dipilih khusus untuk hubungan Anda. Bukan asal cocok, tapi SEMPURNA.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
                        <div>
                            <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Hanya <span className="font-bold text-purple-600">2 menit</span>
                            </p>
                        </div>
                        <div>
                            <Sparkles className="w-6 h-6 mx-auto mb-2 text-pink-600" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Gratis <span className="font-bold text-pink-600">selamanya</span>
                            </p>
                        </div>
                        <div>
                            <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-bold text-amber-600">10 credits</span> (~Rp 500)
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 relative overflow-hidden">
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Mereka Layak Mendapatkan Hadiah Terbaik
                        </h2>
                        <p className="text-xl md:text-2xl mb-8 opacity-90">
                            Dan Anda layak mendapatkan kemudahan menemukannya.
                        </p>

                        <Link href="/gift-ideas/create">
                            <Button
                                size="lg"
                                className="text-lg px-12 py-7 bg-white text-purple-600 hover:bg-slate-100 shadow-2xl hover:shadow-3xl transition-all gap-3 group"
                            >
                                <span>🎁</span>
                                <span className="font-bold">Temukan Hadiah Sempurna Sekarang</span>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                        <p className="mt-6 text-sm opacity-75">
                            ✅ Gratis selamanya &nbsp;&nbsp; 🔒 Data aman & privat &nbsp;&nbsp; ⚡ Langsung dapat hasil
                        </p>

                        <div className="mt-8 text-lg">
                            <p className="mb-2">💭 Bayangkan senyum bahagia mereka besok...</p>
                            <p className="font-semibold">atau tunggu sampai terlambat?</p>
                        </div>

                        <p className="mt-6 text-sm opacity-60">
                            Sudah 2,847+ keluarga bergabung minggu ini 🌙
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

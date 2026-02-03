
export const landingContent = {
    hero: {
        badge: "✨ New: Free AI Family Photos",
        headline: "Bring the Warmth of Ramadan Home",
        subheadline: "Focus on your worship, let AI handle the rest. Create stunning family portraits, plan healthy meals, and find perfect gifts instantly.",
        ctaPrimary: {
            text: "Start Creating Free",
            href: "/signup"
        },
        ctaSecondary: {
            text: "Explore Features",
            href: "#features"
        },
        // Visual assets for the 3D card effect (using existing placeholders or actual assets if available)
        visuals: {
            card1: { title: "Family Photo", icon: "Camera", color: "from-teal-500 to-emerald-500" },
            card2: { title: "Menu Plan", icon: "ChefHat", color: "from-amber-500 to-orange-500" },
            card3: { title: "Gift Ideas", icon: "Gift", color: "from-purple-500 to-pink-500" }
        },
        carouselImages: [
            "https://hdfpxrbiofptltzsdlui.supabase.co/storage/v1/object/public/images/homepage/family_gathering.jpg",
            "https://hdfpxrbiofptltzsdlui.supabase.co/storage/v1/object/public/images/homepage/delicious_iftar.jpg",
            "https://hdfpxrbiofptltzsdlui.supabase.co/storage/v1/object/public/images/homepage/gift_giving.jpg"
        ]
    },
    howItWorks: {
        title: "How It Works",
        subtitle: "Experience the magic of AI in three simple steps",
        steps: [
            {
                title: "1. Choose Your Feature",
                description: "Select from Family Photos, Menu Planning, or Gift Ideas.",
                icon: "LayoutDashboard"
            },
            {
                title: "2. Let AI Create",
                description: "Upload a photo or enter your preferences. Our AI works instantly.",
                icon: "Sparkles"
            },
            {
                title: "3. Share the Joy",
                description: "Download your creation and share it with family and friends.",
                icon: "Share2"
            }
        ]
    },
    features: {
        title: "All-in-One Ramadan Companion",
        subtitle: "Everything you need to make this holy month special.",
        items: [
            {
                id: "photo",
                title: "AI Family Photos",
                description: "Cannot meet in person? Transform your selfies into heartwarming family portraits with professional themes. Choose from 'Modern Muslim Family', 'Traditional Kebaya', or 'Classic Studio'.",
                imageIndex: 0, // Points to carouselImages[0]
                href: "/kartu/family",
                cta: "Create Photo",
                bgGradient: "from-teal-500/10 to-emerald-500/10"
            },
            {
                id: "menu",
                title: "Smart Menu Planner",
                description: "Struggling with Sahur and Iftar ideas? Get personalized, healthy, and Halal meal plans that fit your dietary needs. Includes auto-generated shopping lists.",
                imageIndex: 1, // Points to carouselImages[1]
                href: "/menu",
                cta: "Plan Meals",
                bgGradient: "from-amber-500/10 to-orange-500/10"
            },
            {
                id: "gift",
                title: "Gift Recommendations",
                description: "Find the perfect Eid gifts for your loved ones based on their personality and interests. Our AI suggests unique, thoughtful items.",
                imageIndex: 2, // Points to carouselImages[2]
                href: "/gift-ideas",
                cta: "Find Gifts",
                bgGradient: "from-purple-500/10 to-pink-500/10"
            }
        ]
    },
    testimonials: {
        title: "Trusted by Families",
        subtitle: "See what our community is saying about RamadanHub AI.",
        items: [
            {
                name: "Sarah A.",
                role: "Mother of 3",
                content: "The Menu Planner is a lifesaver! I used to stress about Sahur meals, but now I have a healthy plan for the whole month.",
                rating: 5,
                avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah"
            },
            {
                name: "Rizky P.",
                role: "Graphic Designer",
                content: "I was skeptical about AI photos, but the Family Portrait generator is amazing. It looks like a real studio shot!",
                rating: 5,
                avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Rizky"
            },
            {
                name: "Dewi S.",
                role: "Student",
                content: "Found the perfect Eid gift for my parents using the Gift Ideas feature. They loved it! Highly recommend.",
                rating: 4,
                avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Dewi"
            }
        ]
    },
    faq: {
        title: "Frequently Asked Questions",
        items: [
            {
                question: "Is the generated content Halal?",
                answer: "Yes! Our AI is specifically tuned to provide Halal menu recommendations and culturally appropriate image themes."
            },
            {
                question: "Is it free to use?",
                answer: "We offer a generous free tier for everyone. You get 10 free AI generations to try all features. You can upgrade for more."
            },
            {
                question: "Can I download the family photos?",
                answer: "Absolutely. All generated photos are yours to keep. You can download them in high resolution for printing."
            }
        ]
    },
    cta: {
        title: "Ready to Make This Ramadan Special?",
        subtitle: "Join thousands of families using AI to focus on what matters most—worship and togetherness.",
        buttonText: "Get Started for Free",
        href: "/signup"
    }
}

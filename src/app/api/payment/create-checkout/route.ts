import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createXenditInvoice } from "@/lib/payment/xendit";

// Configuration - Bundle-based pricing
const BUNDLES = {
    starter: { credits: 50, price: 49000, desc: "Starter Pack - 50 Credits" },
    popular: { credits: 150, price: 129000, desc: "Popular Pack - 150 Credits" },
    power: { credits: 500, price: 399000, desc: "Power Pack - 500 Credits" }
} as const;

type BundleType = keyof typeof BUNDLES;

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get bundle from request body, default to "popular"
        const body = await req.json();
        const bundle = (body.bundle || "popular") as BundleType;

        // Validate bundle type
        if (!BUNDLES[bundle]) {
            return NextResponse.json({ error: "Invalid bundle type" }, { status: 400 });
        }

        const config = BUNDLES[bundle];

        const origin = req.headers.get("origin") || "http://localhost:3000";
        const successUrl = `${origin}/?payment=success`;

        // Include bundle type in external ID for webhook parsing
        const externalId = `CREDITS-${bundle.toUpperCase()}-${user.id}-${Date.now()}`;

        const secretKey = process.env.XENDIT_SECRET_KEY;
        console.log("DEBUG POINTER: XENDIT_SECRET_KEY Status");
        console.log("- Exists:", !!secretKey);
        console.log("- Length:", secretKey ? secretKey.length : 0);
        console.log("- First 4 chars:", secretKey ? secretKey.substring(0, 4) : "NULL");
        console.log("- Bundle:", bundle, "Credits:", config.credits, "Price:", config.price);

        if (!secretKey) {
            return NextResponse.json({ error: "Configuration Error: XENDIT_SECRET_KEY is missing. Check server logs." }, { status: 500 });
        }

        // ALWAYS USE XENDIT (Indonesia / Global)
        console.log(`Creating Xendit Invoice for user: ${user.email} (${bundle} bundle)`);

        const invoice = await createXenditInvoice(
            externalId,
            config.price,
            user.email,
            config.desc,
            successUrl
        );

        return NextResponse.json({ url: invoice.invoiceUrl });

    } catch (error: any) {
        console.error("Checkout Creation Failed:", error);
        return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
}

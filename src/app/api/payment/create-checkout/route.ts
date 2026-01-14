import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createXenditInvoice } from "@/lib/payment/xendit";

// Configuration
const PRODUCT_PRICE_IDR = 150000; // ~ $9.99
const PRODUCT_DESC = "RamadanHub Pro Pass (30 Days)";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const origin = req.headers.get("origin") || "http://localhost:3000";
        const successUrl = `${origin}/kartu?payment=success`;

        const externalId = `INV-${user.id}-${Date.now()}`;

        const secretKey = process.env.XENDIT_SECRET_KEY;
        console.log("DEBUG POINTER: XENDIT_SECRET_KEY Status");
        console.log("- Exists:", !!secretKey);
        console.log("- Length:", secretKey ? secretKey.length : 0);
        console.log("- First 4 chars:", secretKey ? secretKey.substring(0, 4) : "NULL");

        if (!secretKey) {
            return NextResponse.json({ error: "Configuration Error: XENDIT_SECRET_KEY is missing. Check server logs." }, { status: 500 });
        }

        // ALWAYS USE XENDIT (Indonesia / Global)
        // User requested Xendit only for now.
        console.log("Creating Xendit Invoice for user:", user.email);

        const invoice = await createXenditInvoice(
            externalId,
            PRODUCT_PRICE_IDR,
            user.email,
            PRODUCT_DESC,
            successUrl
        );

        return NextResponse.json({ url: invoice.invoiceUrl });

    } catch (error: any) {
        console.error("Checkout Creation Failed:", error);
        return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
}

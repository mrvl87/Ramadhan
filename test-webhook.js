// Manual Webhook Test Script
// This simulates a Xendit webhook callback to test our credit addition logic

const WEBHOOK_URL = "http://localhost:3000/api/webhooks/xendit";

// Sample webhook payload from Xendit when payment is PAID
const testPayload = {
    id: "test-invoice-123",
    external_id: "CREDITS-POPULAR-YOUR-USER-ID-HERE-1738032000000", // Replace YOUR-USER-ID-HERE with actual UUID
    status: "PAID",
    amount: 129000,
    payer_email: "test@example.com",
    paid_at: new Date().toISOString(),
    payment_method: "BANK_TRANSFER",
    payment_channel: "BCA"
};

async function testWebhook() {
    console.log("🧪 Testing Xendit Webhook Handler...\n");
    console.log("📦 Payload:", JSON.stringify(testPayload, null, 2));
    console.log("\n⏳ Sending POST request to webhook...\n");

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-callback-token": process.env.XENDIT_CALLBACK_TOKEN || "test-token"
            },
            body: JSON.stringify(testPayload)
        });

        const data = await response.json();

        console.log("📊 Response Status:", response.status);
        console.log("📄 Response Body:", JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log("\n✅ Webhook test PASSED!");
            console.log("💡 Now check your database - user should have +150 credits");
        } else {
            console.log("\n❌ Webhook test FAILED!");
            console.log("🔍 Check the error above for details");
        }
    } catch (error) {
        console.error("\n💥 Fetch Error:", error);
    }
}

// Instructions
console.log("📝 INSTRUCTIONS:");
console.log("1. Replace 'YOUR-USER-ID-HERE' in testPayload.external_id with your actual user UUID");
console.log("   (Get it from Supabase dashboard or run: SELECT id FROM auth.users WHERE email='your@email.com')");
console.log("2. Make sure your dev server is running (npm run dev)");
console.log("3. Run: node test-webhook.js");
console.log("4. Check your credits in the database\n");

testWebhook();

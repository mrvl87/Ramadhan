import {
    lemonsqueezySetup,
    createCheckout,
    NewCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";

// Initialize
if (process.env.LEMONSQUEEZY_API_KEY) {
    lemonsqueezySetup({
        apiKey: process.env.LEMONSQUEEZY_API_KEY,
        onError: (error) => console.error("LemonSqueezy Error:", error),
    });
} else {
    console.warn("LEMONSQUEEZY_API_KEY missing");
}

export async function createLemonSqueezyCheckout(
    storeId: string,
    variantId: string,
    userEmail: string,
    userId: string,
    redirectUrl: string
) {
    try {
        const newCheckout: NewCheckout = {
            productOptions: {
                redirectUrl: redirectUrl,
                receiptButtonText: 'Back to RamadanHub',
                receiptThankYouNote: 'Thank you for upgrading to Pro!',
            },
            checkoutData: {
                email: userEmail,
                custom: {
                    user_id: userId
                }
            },
        };

        const { data, error } = await createCheckout(
            storeId,
            variantId,
            newCheckout
        );

        if (error) {
            throw error;
        }

        return data?.data.attributes.url;

    } catch (error) {
        console.error("LemonSqueezy Checkout Error:", error);
        throw new Error("Failed to create LemonSqueezy Checkout");
    }
}

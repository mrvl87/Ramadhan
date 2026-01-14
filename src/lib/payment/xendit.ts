import Xendit from 'xendit-node';

// Lazy init to prevent crashes if env var is missing
let invoiceClient: any = null;

function getInvoiceClient() {
    if (invoiceClient) return invoiceClient;

    const secretKey = process.env.XENDIT_SECRET_KEY;
    if (!secretKey) {
        throw new Error("XENDIT_SECRET_KEY is missing in environment variables");
    }

    const xenditClient = new Xendit({ secretKey });
    invoiceClient = xenditClient.Invoice;
    return invoiceClient;
}

export async function createXenditInvoice(
    externalId: string,
    amount: number,
    customerEmail: string,
    description: string,
    successRedirectUrl: string
) {
    try {
        const client = getInvoiceClient();
        const response = await client.createInvoice({
            data: {
                externalId: externalId,
                amount: amount,
                payerEmail: customerEmail,
                description: description,
                invoiceDuration: 86400, // 24 hours
                successRedirectUrl: successRedirectUrl,
                currency: 'IDR',
                reminderTime: 1
            }
        });
        return response;
    } catch (error: any) {
        console.error("Xendit Invoice Error Payload:", JSON.stringify(error, null, 2));
        // Try to extract meaningful message from Xendit error response
        const errorMessage = error.response?.data?.message || error.message || JSON.stringify(error);
        throw new Error(errorMessage);
    }
}

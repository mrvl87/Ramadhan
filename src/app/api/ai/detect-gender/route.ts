import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export async function POST(req: Request) {
    try {
        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL required" }, { status: 400 });
        }

        // Use Moondream3 Query Endpoint (VQA)
        console.log("Analyzing image with Moondream3 Query:", imageUrl);

        const result: any = await fal.subscribe("fal-ai/moondream3-preview/query", {
            input: {
                image_url: imageUrl,
                prompt: "Is the person in this photo male or female? Answer single word: 'male' or 'female'.",
            },
        });

        console.log("Fal.ai Raw Output:", JSON.stringify(result, null, 2));

        // Handle various output shapes from Moondream
        // Sometimes it might return `output`, usually just string
        const outputText = result.data?.output || result.data?.caption || "";
        const answer = outputText.toLowerCase().trim();

        console.log("Parsed Answer:", answer);

        let gender: 'male' | 'female' | 'unknown' = 'unknown';

        if (answer.includes('female') || answer.includes('woman') || answer.includes('girl')) {
            gender = 'female';
        } else if (answer.includes('male') || answer.includes('man') || answer.includes('boy')) {
            gender = 'male';
        }

        return NextResponse.json({ gender });

    } catch (error: any) {
        console.error("Gender Detection Error:", error);
        // Fallback to unknown rather than crashing the flow
        return NextResponse.json({ gender: "unknown", error: error.message });
    }
}

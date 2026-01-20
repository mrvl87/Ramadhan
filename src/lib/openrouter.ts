const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'RamadanHub AI';

export const openRouter = {
    chat: async (prompt: string, model: string = 'google/gemini-2.0-flash-exp:free') => {
        if (!OPENROUTER_API_KEY) {
            console.warn("OPENROUTER_KEY is missing!");
            throw new Error("OpenRouter API Key missing");
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": model,
                "messages": [
                    { "role": "user", "content": prompt },
                ]
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`OpenRouter Error: ${response.status} - ${err}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}

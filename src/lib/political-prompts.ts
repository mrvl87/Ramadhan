import { PartyTemplate, CostumeTemplate, AttributeTemplate } from "@/types/templates";

export interface PoliticalPromptInput {
    userGender: 'male' | 'female';
    party: PartyTemplate;
    costume: CostumeTemplate;
    attributes: AttributeTemplate[];
    userName?: string;
}

export function constructPoliticalPrompt(input: PoliticalPromptInput): string {
    const { userGender, party, costume, attributes } = input;

    // 1. Subject Definition
    const costumeDesc = costume.name; // e.g. "Jas Pejabat Emas", "Baju Koko Polos"
    const attributesDesc = attributes.map(a => a.name).join(", "); // e.g. "Peci Hitam, Pin Partai"

    // 2. Style & Atmosphere
    // We stick to the party colors and official vibes
    const primaryColor = party.primary_color;
    const atmosphere = "Professional studio portrait, official political campaign poster style, highly detailed, photorealistic, 8k resolution, soft cinematic lighting";

    // 3. Cultural Context
    const context = "Indonesian official, dignified pose, authoritative but friendly, clean background";

    // 4. Composition
    const prompt = `
        A photorealistic portrait of an Indonesian ${userGender} politician.
        Wearing ${costumeDesc} and ${attributesDesc}.
        Background is a clean solid professional gradient using color ${primaryColor}.
        Theme: ${party.name} aesthetic.
        ${context}.
        ${atmosphere}.
        High quality, sharp focus, official election poster.
    `.trim().replace(/\s+/g, ' ');

    return prompt;
}

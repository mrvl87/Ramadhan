/**
 * PROMPT ENGINE FOR RAMADHAN HUB AI
 * 
 * This module constructs emotional, culturally-aware prompts for Flux.
 * It strictly adheres to Islamic aesthetic guidelines and avoids Western holiday tropes.
 */

export type CardType = 'royal_family' | 'digital_calligraphy' | 'mini_me_cartoon' | 'pious_wish';
export type ThemeKey = 'luxury_gold' | 'minimalist_white' | 'kampung_heritage' | 'spiritual_night';

interface PromptInputs {
    text?: string;       // Family name or wish
    family_desc?: string; // e.g., "Father, Mother, and one daughter"
    gender?: string;     // For single person
}

// 1. THEMES: The Emotional Wrapper
const THEMES: Record<ThemeKey, string> = {
    luxury_gold:
        "Atmosphere of royalty and abundance. Color palette: Gold, Deep Emerald, Cream. \
        Lighting: Cinematic Golden Hour, volumetrics, sparkling dust. \
        Decor: Intricate Arabesque patterns, golden lanterns, marble textures.",

    minimalist_white:
        "Atmosphere of purity, peace, and modernity. Color palette: White, Soft Beige, Silver. \
        Lighting: Bright, soft-diffused daylight, clean shadows. \
        Decor: Modern Islamic geometry, minimal floral arrangements, open space, clean lines.",

    kampung_heritage:
        "Atmosphere of nostalgia, warmth, and tradition. Color palette: Warm Brown, Terracotta, Batik colors. \
        Lighting: Cozy sunset warmth, candle-like glow. \
        Decor: Wooden textures, traditional Nusantara architecture, hanging ketupat (woven rice), batik kain patterns.",

    spiritual_night:
        "Atmosphere of piety, reflection, and quiet prayer. Color palette: Midnight Blue, Purple, Glowing Yellow. \
        Lighting: Moonlit night, strong lantern glow, contrasty. \
        Decor: Starry sky, crescent moon visibility, glowing mosque silhouette in distance."
};

// 2. TEMPLATES: The Subject Matter
const TEMPLATES: Record<CardType, (inputs: PromptInputs) => string> = {
    royal_family: (inputs) =>
        `A photorealistic portrait of an Indonesian family (${inputs.family_desc || "Father, Mother with hijab, and two children"}) \
        standing confidently in specific theme setting. \
        They are wearing modest, stylish premium Muslim fashion (Baju Koko for men, intricate Abaya/Gamis for women). \
        The family is smiling warmly directly at the camera. Perfect facial features, high fashion photography, 85mm portrait lens.`,

    digital_calligraphy: (inputs) =>
        `A stunning 3D Typography Masterpiece. The text "${inputs.text || 'Ramadan Mubarak'}" is crafted from specific theme materials (e.g. gold, clouds, or wood). \
        The text is intertwined with 3D floral elements and islamic geometry. \
        Centered composition, wallpaper quality, sharp focus on the text, hyper-detailed texture.`,

    mini_me_cartoon: (inputs) =>
        `A high-end 3D Pixar-style render of a cute family (${inputs.family_desc || "Father, Mother, Child"}) \
        standing in front of a whimsical version of the theme setting. \
        Big expressive eyes, warm smiles, soft rounded shapes, subsurface scattering on skin. \
        Wearing cute versions of modest Muslim clothing. Magical atmosphere, sparkles.`,

    pious_wish: (inputs) =>
        `A spiritual still-life photography composition. \
        Centerpiece: An open Al-Quran on a wooden Rehal stand, next to a glowing lantern. \
        Background: Blurred view of the chosen theme setting. \
        No people. Focus on the objects, shallow depth of field, bokeh, highly detailed textures.`
};

// 3. NEGATIVE PROMPT: The Safety Net
export const NEGATIVE_PROMPT =
    "western clothing, alcohol, wine glass, cross, church, christmas tree, santa, bikini, revealing clothing, \
    distorted faces, extra fingers, mutated hands, ugly, messy, blurry, low resolution, watermark, text, \
    gloomy, scary, horror, neon cyberpunk, sketch, drawing (unless cartoon style)";


/**
 * MAIN FUNCTION: Constructs the final prompt string.
 */
export function constructEmotionalPrompt(
    type: CardType,
    theme: ThemeKey,
    inputs: PromptInputs
): string {
    const baseTemplate = TEMPLATES[type](inputs);
    const themeWrapper = THEMES[theme] || THEMES['luxury_gold'];

    // Assemble the prompt in layers
    const prompt = `
        ${baseTemplate}
        
        SETTING & THEME:
        ${themeWrapper}
        
        CONTEXT:
        Islamic Celebration, Ramadan Kareem / Eid Al-Fitr context. 
        Culturally correct for Southeast Asia / Global Muslim audience.
        High Quality, 8k, Masterpiece.
    `.trim().replace(/\s+/g, ' '); // Clean up whitespace

    return prompt;
}

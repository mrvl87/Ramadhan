import { WizardState } from "../types";

export function generateComplexPrompt(state: WizardState): string {
    const { config } = state;
    const promptLayers: string[] = [];

    // --- Layer 1: Subject & Composition ---
    let subjectPrompt = `A photo of a ${config.familySize} Muslim family (${config.members.adults} adults, ${config.members.children} children${config.members.elderly ? ', including grandparents' : ''}).`;

    switch (config.familySize) {
        case 'small': // 3-4 org
            subjectPrompt += " Intimate spacing, close interaction, 85mm lens, bokeh background.";
            break;
        case 'medium':
            subjectPrompt += " Balanced group arrangement, 50mm lens, sharp focus on faces.";
            break;
        case 'large':
        case 'extra_large': // 15+ org
            subjectPrompt += " Tiered standing arrangement, wide angle 24mm lens, deep depth of field, everyone visible.";
            break;
    }
    promptLayers.push(subjectPrompt);


    // --- Layer 2: Vibe (Lighting & Color) ---
    let vibePrompt = "";
    switch (config.vibe) {
        case 'warm_homey':
            vibePrompt = "Kodak Portra 400 style, golden hour, nostalgic grain, candid and warm interaction, soft shadows.";
            break;
        case 'formal_studio':
            vibePrompt = "High key lighting, sharp focus, symmetrical composition, professional studio look, clean and crisp.";
            break;
        case 'relaxed_indoor':
            vibePrompt = "Natural window light, relaxed poses, cozy atmosphere, soft diffusion.";
            break;
        case 'spiritual_mosque':
            vibePrompt = "Ethereal lighting shafts, serene atmosphere, respectful and peaceful mood.";
            break;
        case 'clean_modern':
            vibePrompt = "Minimalist bright aesthetic, cool white tones, high contrast, vogue magazine style.";
            break;
    }
    promptLayers.push(vibePrompt);


    // --- Layer 3: Wardrobe (Texture) ---
    let outfitPrompt = "Wearing distinctive Eid fashion: ";
    switch (config.outfit) {
        case 'white_modest':
            outfitPrompt += "All white flowing pure fabric, minimal embroidery, clean spiritual look.";
            break;
        case 'sarimbit_batik':
            outfitPrompt += "Matching Sarimbit Batik clothes, intricate embroidery details, premium fabric texture, cultural elegance.";
            break;
        case 'earth_tone':
            outfitPrompt += "Soft sage green and beige palette, matte texture, linen fabrics, muted harmonious colors.";
            break;
        case 'elegant_dark':
            outfitPrompt += "Navy blue or deep maroon theme, velvet textures, gold accessories/accents, luxurious feel.";
            break;
        case 'auto_ai':
            outfitPrompt += "Festive colorful modern Muslim fashion, high fashion modesty.";
            break;
    }
    promptLayers.push(outfitPrompt);


    // --- Layer 4: Background & Props ---
    let bgPrompt = "Setting: ";
    switch (config.background) {
        case 'living_room':
            bgPrompt += "Modern cozy living room, window light, soft indoor depth, comfortable furniture.";
            break;
        case 'mosque_arch':
            bgPrompt += "Islamic geometric archway background, grand mosque architecture, depth.";
            break;
        case 'solid_studio':
            bgPrompt += "Solid neutral backdrop, studio setting, no distraction.";
            break;
        case 'garden':
            bgPrompt += "Lush green garden, blurry nature background, sunlight filtering through leaves.";
            break;
    }

    if (config.props.ketupat) {
        bgPrompt += " Featuring hanging Ketupat in foreground bokeh.";
    }
    if (config.props.lamps) {
        bgPrompt += " With decorative Moroccan hanging lamps glowing softly.";
    }
    promptLayers.push(bgPrompt);


    // --- Layer 5: Framing (Aspect Ratio specific instruction) ---
    let framingPrompt = "";
    switch (config.aspectRatio) {
        case '9:16':
            framingPrompt = "Low angle shot, lots of negative space at the top for typography, vertical compositions.";
            break;
        case '16:9':
            framingPrompt = "Rule of thirds, subjects positioned for cinematic wide shot, negative space on side for text.";
            break;
        case '4:5':
        case '1:1':
            framingPrompt = "Centered composition, balanced framing.";
            break;
    }
    promptLayers.push(framingPrompt);

    promptLayers.push("High quality, masterpiece, 8k resolution, highly detailed faces.");

    // Join all layers
    const fullPrompt = promptLayers.join(" ");

    // Append Negative Prompt (using --no syntax as a best effort fallthrough)
    return `${fullPrompt} --no ${SAFETY_NEGATIVE_PROMPT}`;
}

export const SAFETY_NEGATIVE_PROMPT = "bad anatomy, distorted faces, blurry, low quality, artifact, deformed hands, missing limbs, watermark, text overlay, extra fingers, ugly, mutation, pixelated";

export interface FamilyPhotoInput {
    style: 'anime' | 'realistic' | 'oil-painting' | '3d-cartoon';
    mode: 'individual' | 'family';
    aspectRatio: 'square' | 'portrait' | 'landscape' | '1:1' | '9:16' | '16:9' | '4:5';
    caption?: string;
    familyType?: 'nuclear' | 'couple' | 'extended'; // Optional hint
    userGender?: 'male' | 'female'; // From detection
    promptOverride?: string; // For new Wizard logic
}

export function constructFamilyPrompt(input: FamilyPhotoInput): string {
    const stylePrompts = {
        'anime': 'anime style, vibrant colors, studio ghibli vibe',
        'realistic': 'hyperrealistic 8k, canon r5 photography, cinematic lighting',
        'oil-painting': 'oil painting style, classic art, textured brushstrokes',
        '3d-cartoon': 'pixar style 3d render, cute, expressive, high detailed'
    };

    let corePrompt = '';

    if (input.mode === 'individual') {
        corePrompt = `A happy Muslim individual celebrating Eid Mubarak (Idul Fitri), wearing modest distinctive festive clothing (green and gold themes). Warm lighting, joyous atmosphere, mosque background visible through window.`;
    } else {
        corePrompt = `A happy Muslim family celebrating Eid Mubarak (Idul Fitri), wearing modest distinctive festive clothing (green and gold themes). Warm lighting, joyous atmosphere, mosque background visible through window.`;
    }

    // Add user insertion prompt handled by the model (e.g. "person in photo")
    // But for Flux/Nano Banana, we might just describe the scene and rely on Image-to-Image strength

    let finalPrompt = `${corePrompt}, ${stylePrompts[input.style]}. High quality, masterpiece.`;

    if (input.caption) {
        finalPrompt += ` Include text "${input.caption}" written elegantly at the bottom.`;
    }

    return finalPrompt;
}

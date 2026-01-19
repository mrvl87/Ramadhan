export interface FamilyPhotoInput {
    style: 'anime' | 'realistic' | 'oil-painting' | '3d-cartoon';
    familyType: 'nuclear' | 'couple' | 'extended'; // Optional hint
    userGender?: 'male' | 'female'; // From detection
}

export function constructFamilyPrompt(input: FamilyPhotoInput): string {
    const stylePrompts = {
        'anime': 'anime style, vibrant colors, studio ghibli vibe',
        'realistic': 'hyperrealistic 8k, canon r5 photography, cinematic lighting',
        'oil-painting': 'oil painting style, classic art, textured brushstrokes',
        '3d-cartoon': 'pixar style 3d render, cute, expressive, high detailed'
    };

    const corePrompt = `A happy Muslim family celebrating Eid Mubarak (Idul Fitri), wearing modest distinctive festive clothing (green and gold themes). Warm lighting, joyous atmosphere, mosque background visible through window.`;

    // Add user insertion prompt handled by the model (e.g. "person in photo")
    // But for Flux/Nano Banana, we might just describe the scene and rely on Image-to-Image strength

    return `${corePrompt}, ${stylePrompts[input.style]}. High quality, masterpiece.`;
}

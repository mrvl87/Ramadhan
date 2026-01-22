export interface WizardState {
    currentStep: number; // 1-5
    config: {
        // STEP 1: Composition
        familySize: 'small' | 'medium' | 'large' | 'extra_large';
        members: { adults: number; children: number; elderly: boolean };

        // STEP 2: Vibe (Hidden: Lighting & Color Grading)
        vibe: 'warm_homey' | 'formal_studio' | 'relaxed_indoor' | 'spiritual_mosque' | 'clean_modern';

        // STEP 3: Wardrobe (Hidden: Texture & Color Harmony)
        outfit: 'white_modest' | 'sarimbit_batik' | 'earth_tone' | 'elegant_dark' | 'auto_ai';

        // STEP 4: Location (Hidden: Depth & Props)
        background: 'living_room' | 'mosque_arch' | 'solid_studio' | 'garden';
        props: { ketupat: boolean; lamps: boolean };

        // STEP 5: Format & Greeting
        aspectRatio: '1:1' | '9:16' | '16:9' | '4:5';
        greeting: {
            recipient: string;
            message: string;
            generated: boolean;
        };
    };
}

export const INITIAL_WIZARD_STATE: WizardState = {
    currentStep: 1,
    config: {
        familySize: 'small',
        members: { adults: 2, children: 1, elderly: false },
        vibe: 'warm_homey',
        outfit: 'white_modest',
        background: 'living_room',
        props: { ketupat: false, lamps: false },
        aspectRatio: '1:1',
        greeting: {
            recipient: '',
            message: '',
            generated: false
        }
    }
};

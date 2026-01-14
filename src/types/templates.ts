export interface PartyTemplate {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    primary_color: string;
    secondary_color: string;
    is_premium: boolean;
}

export interface CostumeTemplate {
    id: string;
    name: string;
    gender: 'male' | 'female' | 'unisex';
    base_image_url: string | null;
    is_premium: boolean;
}

export interface AttributeTemplate {
    id: string;
    name: string;
    type: 'headwear' | 'accessory' | 'badge';
    overlay_image_url: string | null;
    is_premium: boolean;
}

export interface TemplateCollection {
    parties: PartyTemplate[];
    costumes: CostumeTemplate[];
    attributes: AttributeTemplate[];
}

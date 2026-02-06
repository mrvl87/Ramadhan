export interface MenuInput {
    days: number;
    people: number;
    dietary: string;
    theme: 'budget' | 'healthy' | 'luxury';
}

export function constructMenuPrompt(input: MenuInput): string {
    return `Generate a comprehensive ${input.days}-day Ramadan meal plan for ${input.people} people in INDONESIAN language.
    
    Theme: ${input.theme} (Budget=Ekonomis, Healthy=Sehat, Luxury=Istimewa).
    Special Dietary Requirements: ${input.dietary || "None"}.
    
    You MUST respond with a valid JSON object ONLY. Do not include any text before or after the JSON.
    
    The JSON structure must be:
    {
        "menu": [
            {
                "day": number,
                "suhoor": "string (Full menu description in Indonesian)",
                "takjil": "string (Full menu description in Indonesian)",
                "iftar": "string (Full menu description in Indonesian)",
                "calories": "string (e.g. '500 kcal')",
                "protein": "string (e.g. '25g')"
            }
        ],
        "shopping_list": [
            "string (Material/Ingredient name and estimated quantity)"
        ]
    }
    
    Instructions:
    - Language: Indonesian.
    - Suhoor should be energy-boosting.
    - Takjil should be sweet and light.
    - Iftar should be a balanced main meal.
    - Ensure nutritional estimates (calories/protein) are realistic for the theme.`;
}

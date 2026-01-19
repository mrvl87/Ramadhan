export interface MenuInput {
    days: number;
    people: number;
    dietary: string; // e.g. "No spicy", "Vegetarian"
    theme: 'budget' | 'healthy' | 'luxury';
}

export function constructMenuPrompt(input: MenuInput): string {
    return `Generate a ${input.days}-day Ramadan Iftar and Sahur meal plan for ${input.people} people.
    Theme: ${input.theme}.
    Dietary Restrictions: ${input.dietary || "None"}.
    
    Format as JSON:
    {
        "days": [
            {
                "day": 1,
                "sahur": { "dish": "Name", "desc": "Short description" },
                "iftar": { "dish": "Name", "desc": "Short description" },
                "takjil": { "dish": "Name" }
            }
        ]
    }`;
}

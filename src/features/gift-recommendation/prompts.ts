export interface GiftInput {
    recipient: string; // e.g. "Mom", "Best Friend", "Husband"
    age: number;
    budget: string; // e.g. "Under 100k", "Unlimited"
    interests: string;
}

export function constructGiftPrompt(input: GiftInput): string {
    return `Suggest 5 unique and thoughtful Ramadan/Eid gift ideas for my ${input.recipient} (Age: ${input.age}).
    Budget: ${input.budget}.
    Interests: ${input.interests}.
    
    Format as JSON:
    {
        "ideas": [
            {
                "name": "Gift Name",
                "description": "Why it's good",
                "estimated_price": "Price range"
            }
        ]
    }`;
}

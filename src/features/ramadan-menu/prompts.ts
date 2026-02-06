export interface MenuInput {
    days: number;
    people: number;
    dietary: string;
    theme: 'budget' | 'healthy' | 'luxury';
}

export function constructMenuPrompt(input: MenuInput): string {
    return `You are a professional Halal Chef and Nutritionist specializing in Ramadan meals.
Generate a ${input.days}-day Ramadan meal plan (Suhoor, Takjil, and Iftar) for ${input.people} people.

Theme: ${input.theme} (Balance the ingredients and complexity accordingly).
Dietary Restrictions/Notes: ${input.dietary || "None"}.

Requirements:
1. Format your entire response as a single valid JSON object.
2. Suhoor should be energy-boosting and hydrating.
3. Iftar should be balanced and festive but healthy.
4. Include a categorized shopping list for the entire period.
5. All dishes MUST be Halal and suitable for Ramadan.

Respond EXACTLY in this JSON format:
{
  "title": "A descriptive title for this plan",
  "menu": [
    {
      "day": 1,
      "suhoor": { 
        "dish": "Dish name", 
        "recipe": "Very brief preparation tip",
        "nutrients": "e.g., High fiber, Slow-release energy" 
      },
      "takjil": { "dish": "Sweet starter name" },
      "iftar": { 
        "dish": "Main dish name", 
        "recipe": "Very brief preparation tip",
        "nutrients": "e.g., Protein rich, Hydrating"
      }
    }
  ],
  "shopping_list": {
    "produce": ["list of fruits/veg"],
    "protein": ["list of meats/eggs/beans"],
    "pantry": ["spices, oils, grains"]
  }
}`;
}

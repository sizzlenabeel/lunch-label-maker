import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface TranslationInput {
  name: string;
  ingredients: string;
  allergens: string;
  consumptionGuidelines: string;
  description: string;
}

export async function translateToEnglish(input: TranslationInput) {
  const prompt = `
Translate the following food product details from Swedish to English. Keep the translations natural and accurate:

Name: ${input.name}
Ingredients: ${input.ingredients}
Allergens: ${input.allergens}
Consumption Guidelines: ${input.consumptionGuidelines}
Description: ${input.description}

Format the response as a JSON object with the following keys: name, ingredients, allergens, consumptionGuidelines, description
`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: prompt + "\n\nFor ingredients and allergens, please provide them as comma-separated values without array notation or quotes." 
      }],
      model: "gpt-5-nano",
      response_format: { type: "json_object" }
    });

    let response = JSON.parse(completion.choices[0].message.content);
    
    // Clean up any array notation in ingredients and allergens
    if (response.ingredients) {
      response.ingredients = response.ingredients.replace(/[\[\]"]/g, '').trim();
    }
    if (response.allergens) {
      response.allergens = response.allergens.replace(/[\[\]"]/g, '').trim();
    }
    
    return response as TranslationInput;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate content');
  }
}

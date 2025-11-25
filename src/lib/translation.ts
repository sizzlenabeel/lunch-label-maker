interface TranslationInput {
  name: string;
  ingredients: string;
  allergens: string;
  consumptionGuidelines: string;
  description: string;
}

export async function translateToEnglish(input: TranslationInput) {
  try {
    const response = await fetch(
      'https://bovopbgjrgjjratouilb.supabase.co/functions/v1/translate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Translation failed');
    }

    const translation = await response.json();
    return translation as TranslationInput;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to translate content');
  }
}

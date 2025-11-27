import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationInput {
  name: string;
  ingredients: string;
  allergens: string;
  consumptionGuidelines: string;
  description: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: TranslationInput = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const prompt = `
Translate the following food product details from Swedish to English. Keep the translations natural and accurate:

Name: ${input.name}
Ingredients: ${input.ingredients}
Allergens: ${input.allergens}
Consumption Guidelines: ${input.consumptionGuidelines}
Description: ${input.description}

IMPORTANT: For ingredients and allergens, provide them as comma-separated values without array notation, brackets, or quotes.

Return a JSON object with these exact keys: name, ingredients, allergens, consumptionGuidelines, description
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional translator. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Invalid API key. Please check your OpenAI API key configuration.' }), 
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data, null, 2));
    
    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }
    
    const content = data.choices[0].message.content;
    if (!content || content.trim() === '') {
      console.error('Empty content in OpenAI response');
      throw new Error('Empty response from OpenAI API');
    }
    
    console.log('Content to parse:', content);
    
    let translation;
    try {
      translation = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      throw new Error('Failed to parse translation response as JSON');
    }
    
    // Clean up any array notation in ingredients and allergens
    if (translation.ingredients) {
      translation.ingredients = translation.ingredients.replace(/[\[\]"]/g, '').trim();
    }
    if (translation.allergens) {
      translation.allergens = translation.allergens.replace(/[\[\]"]/g, '').trim();
    }

    return new Response(
      JSON.stringify(translation),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Translation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

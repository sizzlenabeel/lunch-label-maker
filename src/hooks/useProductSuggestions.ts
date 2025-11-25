import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductSuggestion {
  id: string;
  name: string;
  ingredients: string;
  allergens: string;
  consumption_guidelines: string;
  description: string;
  is_vegan: boolean;
  price: number | null;
  is_for_storytel: boolean;
  is_only_for_storytel: boolean;
  delivery_day: string | null;
  translated_name?: string | null;
  translated_ingredients?: any; // Json type from database
  translated_allergens?: string | null;
  translated_consumption_guidelines?: string | null;
  translated_description?: string | null;
}

export function useProductSuggestions() {
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          ingredients,
          allergens,
          consumption_guidelines,
          description,
          is_vegan,
          price,
          is_for_storytel,
          is_only_for_storytel,
          delivery_day,
          translated_name,
          translated_ingredients,
          translated_allergens,
          translated_consumption_guidelines,
          translated_description
        `)
        .ilike('name', `%${query}%`)
        .limit(5);

      if (supabaseError) throw supabaseError;
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  return {
    suggestions,
    setSuggestions,
    showSuggestions,
    setShowSuggestions,
    selectedProduct,
    setSelectedProduct,
    fetchSuggestions
  };
}
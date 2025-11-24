import { supabase } from '@/integrations/supabase/client';
import type { FoodLabel } from '../types';

interface ProductData {
  name: string;
  due_date: string;
  price: number | null;
  ingredients: string;
  allergens: string;
  consumption_guidelines: string;
  description: string;
  font_size: 'normal' | 'small' | 'smaller';
  week_number: number;
  is_vegan: boolean;
  translated_name?: string | null;
  translated_ingredients?: string | null;
  translated_allergens?: string | null;
  translated_consumption_guidelines?: string | null;
  translated_description?: string | null;
}

export async function saveProduct(
  formData: FoodLabel, 
  translatedData: {
    name: string;
    ingredients: string;
    allergens: string;
    consumptionGuidelines: string;
    description: string;
  },
  productId: string | null
) {
  // Prepare product data
  const productData: ProductData = {
    name: formData.name,
    due_date: formData.dueDate,
    price: formData.price ? parseFloat(formData.price) : null,
    ingredients: formData.ingredients,
    allergens: formData.allergens,
    consumption_guidelines: formData.consumptionGuidelines,
    description: formData.description,
    font_size: formData.fontSize,
    week_number: parseInt(formData.weekNumber),
    is_vegan: formData.isVegan,
    translated_name: translatedData.name,
    translated_ingredients: translatedData.ingredients,
    translated_allergens: translatedData.allergens,
    translated_consumption_guidelines: translatedData.consumptionGuidelines,
    translated_description: translatedData.description
  };

  if (productId) {
    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId);
    if (error) throw error;
    return productId;
  } else {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        id: crypto.randomUUID(),
        ...productData
      }])
      .select('id')
      .single();
    if (error) throw error;
    return data?.id || '';
  }
}
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
  is_for_storytel: boolean;
  is_only_for_storytel: boolean;
  delivery_day: string;
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
    is_for_storytel: formData.isForStorytel,
    is_only_for_storytel: formData.isOnlyForStorytel,
    delivery_day: formData.deliveryDay,
    translated_name: translatedData.name,
    translated_ingredients: translatedData.ingredients,
    translated_allergens: translatedData.allergens,
    translated_consumption_guidelines: translatedData.consumptionGuidelines,
    translated_description: translatedData.description
  };

  console.log('Saving product with data:', productData);

  if (productId) {
    console.log('Updating existing product:', productId);
    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId);
    
    if (error) {
      console.error('Error updating product:', error);
      throw new Error(`Failed to update product: ${error.message}`);
    }
    console.log('Product updated successfully');
    return productId;
  } else {
    console.log('Inserting new product');
    const newId = crypto.randomUUID();
    const { data, error } = await supabase
      .from('products')
      .insert([{
        id: newId,
        ...productData
      }])
      .select('id')
      .single();
    
    if (error) {
      console.error('Error inserting product:', error);
      throw new Error(`Failed to insert product: ${error.message}`);
    }
    console.log('Product inserted successfully:', data);
    return data?.id || newId;
  }
}
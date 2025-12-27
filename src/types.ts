interface ProductSuggestion {
  id: string;
  name: string;
  ingredients: string;
  allergens: string;
  consumption_guidelines: string;
  description: string;
  is_vegan: boolean;
  translated_name?: string;
  translated_ingredients?: string;
  translated_allergens?: string;
  translated_consumption_guidelines?: string;
  translated_description?: string;
}

export interface FoodLabel {
  name: string;
  dueDate: string;
  ingredients: string;
  allergens: string;
  consumptionGuidelines: string;
  description: string;
  fontSize: 'normal' | 'small' | 'smaller';
  weekNumber: string;
  isVegan: boolean;
  price: string;
  isForStorytel: boolean;
  isOnlyForStorytel: boolean;
  deliveryDay: string;
  isSnack: boolean;
}
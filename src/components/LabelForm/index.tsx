import React, { useState } from 'react';
import { getWeek } from 'date-fns';
import type { FoodLabel } from '../../types';
import { FormFields } from './FormFields';
import { ProductSearch } from './ProductSearch';
import { TranslationSection } from './TranslationSection';
import { useProductSuggestions, ProductSuggestion } from '../../hooks/useProductSuggestions';
import { useTranslation } from '../../hooks/useTranslation';
import { saveProduct } from '../../services/productService';

interface LabelFormProps {
  onSubmit: (data: FoodLabel) => void;
}

export function LabelForm({ onSubmit }: LabelFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });

  const {
    suggestions,
    showSuggestions,
    setShowSuggestions,
    selectedProduct,
    setSelectedProduct,
    fetchSuggestions
  } = useProductSuggestions();

  const {
    translatedData,
    setTranslatedData,
    isTranslating,
    generateTranslation,
    handleTranslationChange
  } = useTranslation();

  const [formData, setFormData] = useState<FoodLabel>({
    name: '',
    dueDate: '',
    price: '',
    ingredients: '',
    allergens: '',
    consumptionGuidelines: '',
    description: '',
    fontSize: 'smaller',
    weekNumber: currentWeek.toString(),
    isVegan: false,
    isForStorytel: false,
    isOnlyForStorytel: false,
    deliveryDay: ''
  });

  const selectSuggestion = (suggestion: ProductSuggestion) => {
    setSelectedProduct(suggestion.id);
    // Set form data from suggestion
    setFormData({
      ...formData,
      name: suggestion.name,
      ingredients: suggestion.ingredients,
      allergens: suggestion.allergens,
      price: suggestion.price?.toString() || '',
      consumptionGuidelines: suggestion.consumption_guidelines,
      description: suggestion.description,
      isVegan: suggestion.is_vegan,
      isForStorytel: suggestion.is_for_storytel,
      isOnlyForStorytel: suggestion.is_only_for_storytel,
      deliveryDay: suggestion.delivery_day || ''
    });
    // Set translation data if available
    const translatedIngredients = typeof suggestion.translated_ingredients === 'string' 
      ? suggestion.translated_ingredients 
      : '';
    setTranslatedData({
      name: suggestion.translated_name || '',
      ingredients: translatedIngredients,
      allergens: suggestion.translated_allergens || '',
      consumptionGuidelines: suggestion.translated_consumption_guidelines || '',
      description: suggestion.translated_description || ''
    });
    setShowSuggestions(false);
  };

  const clearSelection = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      dueDate: '',
      price: '',
      ingredients: '',
      allergens: '',
      consumptionGuidelines: '',
      description: '',
      fontSize: 'smaller',
      weekNumber: currentWeek.toString(),
      isVegan: false,
      isForStorytel: false,
      isOnlyForStorytel: false,
      deliveryDay: ''
    });
    setTranslatedData({
      name: '',
      ingredients: '',
      allergens: '',
      consumptionGuidelines: '',
      description: ''
    });
  };

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, name: value }));
    fetchSuggestions(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDeliveryDayChange = (day: string) => {
    setFormData(prev => ({ ...prev, deliveryDay: day }));
  };

  const handleGenerateTranslation = async () => {
    await generateTranslation(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log('Form submission started with data:', formData);
    console.log('Translation data:', translatedData);
    console.log('Selected product ID:', selectedProduct);

    try {
      const result = await saveProduct(formData, translatedData, selectedProduct);
      console.log('Product saved successfully, ID:', result);
      onSubmit(formData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while saving';
      console.error('Error saving product:', err);
      console.error('Error details:', { formData, translatedData, selectedProduct });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <ProductSearch
            productName={formData.name}
            onProductNameChange={handleProductNameChange}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            selectSuggestion={selectSuggestion}
            selectedProduct={selectedProduct}
            clearSelection={clearSelection}
          />
          
          <FormFields
            formData={formData}
            currentWeek={currentWeek}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleCheckboxChange={handleCheckboxChange}
            handleDeliveryDayChange={handleDeliveryDayChange}
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <TranslationSection
            translatedData={translatedData}
            handleTranslationChange={handleTranslationChange}
            generateTranslation={handleGenerateTranslation}
            isTranslating={isTranslating}
            isEnabled={!!formData.name && !!formData.ingredients}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm mb-4 mt-4">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex justify-center rounded-md border-2 border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 mt-6"
      >
        {isSubmitting ? 'Saving...' : 'Generate Labels'}
      </button>
    </form>
  );
}
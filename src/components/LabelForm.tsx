import React, { useState } from 'react';
import type { FoodLabel } from '../types';
import { supabase } from '../lib/supabase';
import { getWeek } from 'date-fns';
import { Leaf, Search } from 'lucide-react';
import { translateToEnglish } from '../lib/translation';

interface LabelFormProps {
  onSubmit: (data: FoodLabel) => void;
}

interface ProductSuggestion {
  id: string;
  name: string;
  ingredients: string;
  allergens: string;
  consumption_guidelines: string;
  description: string;
  is_vegan: boolean;
  price: string | null;
}

export function LabelForm({ onSubmit }: LabelFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [translatedData, setTranslatedData] = useState({
    name: '',
    ingredients: '',
    allergens: '',
    consumptionGuidelines: '',
    description: ''
  });
  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });

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
    isVegan: false
  });

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
      isVegan: suggestion.is_vegan
    });
    // Set translation data if available
    setTranslatedData({
      name: suggestion.translated_name || '',
      ingredients: suggestion.translated_ingredients || '',
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
      isVegan: false
    });
    setTranslatedData({
      name: '',
      ingredients: '',
      allergens: '',
      consumptionGuidelines: '',
      description: ''
    });
  };

  const generateTranslation = async () => {
    try {
      setIsTranslating(true);
      const translation = await translateToEnglish({
        name: formData.name,
        ingredients: formData.ingredients,
        allergens: formData.allergens,
        consumptionGuidelines: formData.consumptionGuidelines,
        description: formData.description
      });
      setTranslatedData(translation);
    } catch (err) {
      setError('Failed to generate translation. Please try again or enter manually.');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare product data
      const productData = {
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

      let productId = selectedProduct;
      
      if (selectedProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', selectedProduct);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select('id')
          .single();
        if (error) throw error;
        productId = data.id;
      }

      // If successful, pass the data to parent component
      onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
      console.error('Error saving product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'name') {
      fetchSuggestions(value);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleTranslationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTranslatedData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Product Information */}
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setShowSuggestions(true)}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm pr-10"
                  required
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {selectedProduct && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="mt-1 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
                >
                  Add New Product
                </button>
              )}
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  >
                    <span className="block text-sm text-gray-900">{suggestion.name}</span>
                    <span className="block text-xs text-gray-500 truncate">
                      {suggestion.ingredients}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (SEK)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
              required
            />
          </div>

          <div className="flex items-center bg-green-50 p-3 rounded-lg border border-green-200">
            <input
              type="checkbox"
              id="isVegan"
              name="isVegan"
              checked={formData.isVegan}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-green-600 focus:ring-green-500 border border-green-300 rounded"
            />
            <label htmlFor="isVegan" className="ml-2 block text-sm text-green-700 font-medium flex items-center">
              <Leaf className="w-4 h-4 mr-1" />
              This product is vegan
            </label>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="allergens" className="block text-sm font-medium text-gray-700">
              Allergens
            </label>
            <input
              type="text"
              id="allergens"
              name="allergens"
              value={formData.allergens}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="consumptionGuidelines" className="block text-sm font-medium text-gray-700">
              Consumption Guidelines
            </label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, consumptionGuidelines: "Värm upp i mikron i 3 minuter" }))}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
              >
                Värm i mikron
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, consumptionGuidelines: "Ät kall/rumstemperatur" }))}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
              >
                Ät kall
              </button>
            </div>
            <input
              type="text"
              id="consumptionGuidelines"
              name="consumptionGuidelines"
              value={formData.consumptionGuidelines}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Right Column - Font Size, Week Number, and Translation */}
        <div className="space-y-4">
          <div>
            <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">
              Font Size
            </label>
            <select
              id="fontSize"
              name="fontSize"
              value={formData.fontSize}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
            >
              <option value="normal">Normal</option>
              <option value="small">Small</option>
              <option value="smaller">Smaller</option>
            </select>
          </div>

          <div>
            <label htmlFor="weekNumber" className="block text-sm font-medium text-gray-700">
              Week Number
            </label>
            <input
              type="number"
              id="weekNumber"
              name="weekNumber"
              min="1"
              max="53"
              placeholder={currentWeek.toString()}
              value={formData.weekNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Current week: {currentWeek}
            </p>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">English Translation</h3>
            
            <button
              type="button"
              onClick={generateTranslation}
              disabled={isTranslating || !formData.name || !formData.ingredients}
              className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTranslating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Translating...
                </>
              ) : (
                'Generate English Translation'
              )}
            </button>

            <div>
              <label htmlFor="translatedName" className="block text-sm font-medium text-gray-700">
                Product Name (English)
              </label>
              <input
                type="text"
                id="translatedName"
                name="name"
                value={translatedData.name}
                onChange={handleTranslationChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="translatedIngredients" className="block text-sm font-medium text-gray-700">
                Ingredients (English)
              </label>
              <textarea
                id="translatedIngredients"
                name="ingredients"
                value={translatedData.ingredients}
                onChange={handleTranslationChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="translatedAllergens" className="block text-sm font-medium text-gray-700">
                Allergens (English)
              </label>
              <input
                type="text"
                id="translatedAllergens"
                name="allergens"
                value={translatedData.allergens}
                onChange={handleTranslationChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="translatedConsumptionGuidelines" className="block text-sm font-medium text-gray-700">
                Consumption Guidelines (English)
              </label>
              <input
                type="text"
                id="translatedConsumptionGuidelines"
                name="consumptionGuidelines"
                value={translatedData.consumptionGuidelines}
                onChange={handleTranslationChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="translatedDescription" className="block text-sm font-medium text-gray-700">
                Description (English)
              </label>
              <textarea
                id="translatedDescription"
                name="description"
                value={translatedData.description}
                onChange={handleTranslationChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm mt-6 mb-4">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex justify-center rounded-md border border-transparent bg-brand py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
      >
        {isSubmitting ? 'Saving...' : 'Generate Labels'}
      </button>
    </form>
  );
}
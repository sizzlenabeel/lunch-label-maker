import React, { useEffect, useState } from 'react';
import { getWeek } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Leaf } from 'lucide-react';
import { StorytelLabelPDF } from './StorytelLabelPDF';
import type { FoodLabel } from '../types';

export function StorytelLabelsView() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'small' | 'smaller'>('normal');

  useEffect(() => {
    async function fetchStorytelProducts() {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('products')
          .select('*')
          .eq('week_number', selectedWeek)
          .or('is_for_storytel.eq.true,is_only_for_storytel.eq.true');

        if (supabaseError) throw supabaseError;
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error('Error fetching Storytel products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStorytelProducts();
  }, [selectedWeek]);

  const convertToLabelData = (product: any): FoodLabel => {
    return {
      name: product.name,
      dueDate: product.due_date,
      price: product.price?.toString() || '',
      ingredients: product.ingredients,
      allergens: product.allergens,
      consumptionGuidelines: product.consumption_guidelines,
      description: product.description,
      fontSize: fontSize,
      weekNumber: product.week_number.toString(),
      isVegan: product.is_vegan,
      isForStorytel: product.is_for_storytel,
      isOnlyForStorytel: product.is_only_for_storytel,
      deliveryDay: product.delivery_day || ''
    };
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-purple-900">Storytel Labels</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="weekSelect" className="text-sm text-gray-600">
              Select Week:
            </label>
            <select
              id="weekSelect"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
            >
              {Array.from({ length: 53 }, (_, i) => i + 1).map((week) => (
                <option key={week} value={week}>
                  Week {week} {week === currentWeek ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as 'normal' | 'small' | 'smaller')}
              className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
            >
              <option value="normal">Normal Size</option>
              <option value="small">Small Size</option>
              <option value="smaller">Smaller Size</option>
            </select>
          )}
        </div>
      </div>

      {selectedProduct ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Labels for: {selectedProduct.name}
            </h3>
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Back to Product List
            </button>
          </div>
          <StorytelLabelPDF data={convertToLabelData(selectedProduct)} />
        </div>
      ) : loading ? (
        <div className="text-center py-4">
          <div className="animate-pulse text-gray-500">Loading Storytel products...</div>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-600 flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No Storytel products found for week {selectedWeek}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="border border-purple-200 rounded-lg p-4 hover:bg-purple-50 transition-colors cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.is_vegan && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Leaf className="w-3 h-3 mr-1" />
                      Vegan
                    </span>
                  )}
                  {product.is_only_for_storytel ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Only Storytel
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                      Also Storytel
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              {product.delivery_day && (
                <p className="text-xs text-purple-600 mt-2">
                  Delivery: {product.delivery_day}
                </p>
              )}
              <p className="text-xs text-purple-500 mt-2 italic">
                Click to generate labels
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

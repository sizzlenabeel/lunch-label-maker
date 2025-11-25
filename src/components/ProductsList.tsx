import React, { useEffect, useState } from 'react';
import { getWeek } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, FileText, Leaf } from 'lucide-react';
import { NewWeeklyMenuPDF } from './NewWeeklyMenuPDF';
import { StorytelMenuPDF } from './StorytelMenuPDF';

interface Product {
  name: string;
  description: string;
  allergens: string;
  is_vegan: boolean;
  is_for_storytel: boolean;
  is_only_for_storytel: boolean;
  delivery_day: string | null;
}

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [showVeganOnly, setShowVeganOnly] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuFontSize, setMenuFontSize] = useState<'normal' | 'small' | 'smaller'>('normal');
  const [menuType, setMenuType] = useState<'standard' | 'storytel'>('standard');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let query = supabase
          .from('products')
          .select('name, description, allergens, is_vegan, is_for_storytel, is_only_for_storytel, delivery_day')
          .eq('week_number', selectedWeek);

        // Filter based on menu type
        if (menuType === 'storytel') {
          query = query.or('is_for_storytel.eq.true,is_only_for_storytel.eq.true');
        } else {
          // Standard menu excludes "only for storytel" items
          query = query.or('is_only_for_storytel.eq.false,is_only_for_storytel.is.null');
        }

        if (showVeganOnly) {
          query = query.eq('is_vegan', true);
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) throw supabaseError;

        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedWeek, showVeganOnly, menuType]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Products List</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label htmlFor="weekSelect" className="text-sm text-gray-600">
              Select Week:
            </label>
            <select
              id="weekSelect"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            >
              {Array.from({ length: 53 }, (_, i) => i + 1).map((week) => (
                <option key={week} value={week}>
                  Week {week} {week === currentWeek ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="veganFilter"
              checked={showVeganOnly}
              onChange={(e) => setShowVeganOnly(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
            />
            <label htmlFor="veganFilter" className="text-sm text-gray-600 flex items-center">
              <Leaf className="w-4 h-4 mr-1 text-green-600" />
              Vegan Only
            </label>
          </div>
          
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FileText className="w-4 h-4 mr-2" />
            {showMenu ? 'Hide Menu' : 'Show Menu'}
          </button>
          
          {showMenu && (
            <>
              <div className="flex gap-2">
                <button
                  onClick={() => setMenuType('standard')}
                  className={`px-3 py-1 rounded border-2 text-sm font-medium transition-colors ${
                    menuType === 'standard'
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50'
                  }`}
                >
                  Standard Menu
                </button>
                <button
                  onClick={() => setMenuType('storytel')}
                  className={`px-3 py-1 rounded border-2 text-sm font-medium transition-colors ${
                    menuType === 'storytel'
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50'
                  }`}
                >
                  Storytel Menu
                </button>
              </div>
              <select
                value={menuFontSize}
                onChange={(e) => setMenuFontSize(e.target.value as 'normal' | 'small' | 'smaller')}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              >
                <option value="normal">Normal Size</option>
                <option value="small">Small Size</option>
                <option value="smaller">Smaller Size</option>
              </select>
            </>
          )}
        </div>
      </div>

      {showMenu && (
        <div className="mb-6">
          {menuType === 'standard' ? (
            <NewWeeklyMenuPDF 
              weekNumber={selectedWeek} 
              veganOnly={showVeganOnly}
              fontSize={menuFontSize}
            />
          ) : (
            <StorytelMenuPDF 
              weekNumber={selectedWeek} 
              fontSize={menuFontSize}
            />
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-pulse text-gray-500">Loading products...</div>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-600 flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No products found for week {selectedWeek}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
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
                  {product.is_only_for_storytel && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Only Storytel
                    </span>
                  )}
                  {product.is_for_storytel && !product.is_only_for_storytel && (
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
              {product.allergens && (
                <p className="text-sm text-red-600 mt-2">
                  <span className="font-medium">Allergens:</span> {product.allergens}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
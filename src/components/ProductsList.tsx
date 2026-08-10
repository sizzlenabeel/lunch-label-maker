import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getWeek } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Cookie, Download, FileText, Leaf, Loader2, Package, Trash2 } from 'lucide-react';
import { NewWeeklyMenuPDF } from './NewWeeklyMenuPDF';
import { StorytelMenuPDF } from './StorytelMenuPDF';
import { LabelPDF } from './LabelPDF';
import { StorytelLabelPDF } from './StorytelLabelPDF';
import { SnackLabelPDF } from './SnackLabelPDF';
import { downloadLabelsZip, downloadLabelsCombinedPdf } from '@/lib/bulkLabels';
import type { FoodLabel } from '../types';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductsListProps {
  isAdmin?: boolean;
}

export function ProductsList({ isAdmin = false }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [showVeganOnly, setShowVeganOnly] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuFontSize, setMenuFontSize] = useState<'normal' | 'small' | 'smaller'>('normal');
  const [menuType, setMenuType] = useState<'standard' | 'storytel'>('standard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'small' | 'smaller'>('normal');
  const scrollPositionRef = useRef(0);
  type BulkJob = 'food-zip' | 'food-pdf' | 'snack-zip' | 'snack-pdf';
  const [bulkBusy, setBulkBusy] = useState<BulkJob | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkFontSize, setBulkFontSize] = useState<'auto' | 'normal' | 'small' | 'smaller'>('auto');
  const bulkFontOverride = bulkFontSize === 'auto' ? undefined : bulkFontSize;

  const foodProducts = useMemo(() => products.filter((p) => !p.is_snack), [products]);
  const snackProducts = useMemo(() => products.filter((p) => p.is_snack), [products]);

  const runBulk = async (job: BulkJob, fn: () => Promise<void>) => {
    try {
      setBulkError(null);
      setBulkBusy(job);
      await fn();
    } catch (err) {
      console.error('Bulk download failed:', err);
      setBulkError(err instanceof Error ? err.message : 'Bulk download failed');
    } finally {
      setBulkBusy(null);
    }
  };

  const handleProductClick = (product: Product) => {
    scrollPositionRef.current = window.scrollY;
    setSelectedProduct(product);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPositionRef.current);
    });
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!isAdmin || !window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id);
    if (deleteError) {
      setError(`Failed to delete product: ${deleteError.message}`);
      return;
    }

    setProducts(currentProducts => currentProducts.filter(item => item.id !== product.id));
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let query = supabase
          .from('products')
          .select('*')
          .eq('week_number', selectedWeek);

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
  }, [selectedWeek, showVeganOnly]);

  const convertToLabelData = (product: Product): FoodLabel => {
    return {
      name: product.name || '',
      dueDate: product.due_date || '',
      price: product.price?.toString() || '',
      ingredients: product.ingredients || '',
      allergens: product.allergens || '',
      consumptionGuidelines: product.consumption_guidelines || '',
      description: product.description || '',
      fontSize: fontSize,
      weekNumber: product.week_number?.toString() || '',
      isVegan: product.is_vegan || false,
      isForStorytel: product.is_for_storytel || false,
      isOnlyForStorytel: product.is_only_for_storytel || false,
      deliveryDay: product.delivery_day || '',
      isSnack: product.is_snack || false,
      types: product.types?.length ? product.types : ['FOOD']
    };
  };

  const renderLabelForProduct = (product: Product) => {
    const labelData = convertToLabelData(product);
    if (product.is_only_for_storytel) {
      return <StorytelLabelPDF data={labelData} />;
    }
    if (product.is_snack) {
      return <SnackLabelPDF data={labelData} />;
    }
    return <LabelPDF data={labelData} />;
  };

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
          
          {!selectedProduct && (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FileText className="w-4 h-4 mr-2" />
              {showMenu ? 'Hide Menu' : 'Show Menu'}
            </button>
          )}
          
          {showMenu && !selectedProduct && (
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

          {selectedProduct && (
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as 'normal' | 'small' | 'smaller')}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            >
              <option value="normal">Normal Size</option>
              <option value="small">Small Size</option>
              <option value="smaller">Smaller Size</option>
            </select>
          )}
        </div>
      </div>

      {showMenu && !selectedProduct && (
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

      {!selectedProduct && (
        <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Bulk download (Week {selectedWeek})
            </h3>
            <div className="flex items-center gap-2">
              {bulkError && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {bulkError}
                </span>
              )}
              <label className="text-xs text-gray-600" htmlFor="bulk-font-size">
                Font size
              </label>
              <select
                id="bulk-font-size"
                value={bulkFontSize}
                onChange={(e) => setBulkFontSize(e.target.value as typeof bulkFontSize)}
                className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
              >
                <option value="auto">Auto (per product)</option>
                <option value="normal">Normal</option>
                <option value="small">Small</option>
                <option value="smaller">Smaller</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-orange-200 rounded-md p-3 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-800">
                  Food labels ({foodProducts.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    runBulk('food-zip', () =>
                      downloadLabelsZip(foodProducts, `food-labels-week-${selectedWeek}.zip`, bulkFontOverride),
                    )
                  }
                  disabled={foodProducts.length === 0 || bulkBusy !== null}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded border-2 border-orange-500 text-sm text-orange-600 bg-white hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkBusy === 'food-zip' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  ZIP (per label)
                </button>
                <button
                  onClick={() =>
                    runBulk('food-pdf', () =>
                      downloadLabelsCombinedPdf(
                        foodProducts,
                        `food-labels-week-${selectedWeek}.pdf`,
                        bulkFontOverride,
                      ),
                    )
                  }
                  disabled={foodProducts.length === 0 || bulkBusy !== null}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded border-2 border-orange-500 text-sm text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkBusy === 'food-pdf' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  Combined PDF
                </button>
              </div>
            </div>

            <div className="border border-amber-200 rounded-md p-3 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-800">
                  Snack labels ({snackProducts.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    runBulk('snack-zip', () =>
                      downloadLabelsZip(snackProducts, `snack-labels-week-${selectedWeek}.zip`, bulkFontOverride),
                    )
                  }
                  disabled={snackProducts.length === 0 || bulkBusy !== null}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded border-2 border-amber-500 text-sm text-amber-600 bg-white hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkBusy === 'snack-zip' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  ZIP (per label)
                </button>
                <button
                  onClick={() =>
                    runBulk('snack-pdf', () =>
                      downloadLabelsCombinedPdf(
                        snackProducts,
                        `snack-labels-week-${selectedWeek}.pdf`,
                        bulkFontOverride,
                      ),
                    )
                  }
                  disabled={snackProducts.length === 0 || bulkBusy !== null}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded border-2 border-amber-500 text-sm text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkBusy === 'snack-pdf' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  Combined PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProduct ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Labels for: {selectedProduct.name}
            </h3>
            <button
              onClick={handleBackToList}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Back to Product List
            </button>
          </div>
          {renderLabelForProduct(selectedProduct)}
        </div>
      ) : loading ? (
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
              key={product.id || index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <div className="flex gap-2 flex-wrap">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={event => {
                        event.stopPropagation();
                        handleDeleteProduct(product);
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  )}
                  {product.is_snack && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Cookie className="w-3 h-3 mr-1" />
                      Snack
                    </span>
                  )}
                  {product.is_vegan && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Leaf className="w-3 h-3 mr-1" />
                      Vegan
                    </span>
                  )}
                  {!product.is_vegan && product.is_vegetarian && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <Leaf className="w-3 h-3 mr-1" />
                      Vegetarian
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
              {product.storytel_delivery_days?.length ? (
                <p className="text-xs text-purple-600 mt-2">
                  Storytel days: {product.storytel_delivery_days.join(', ')}
                </p>
              ) : product.delivery_day ? (
                <p className="text-xs text-purple-600 mt-2">
                  Delivery: {product.delivery_day}
                </p>
              ) : null}
              {product.allergens && (
                <p className="text-sm text-red-600 mt-2">
                  <span className="font-medium">Allergens:</span> {product.allergens}
                </p>
              )}
              <p className="text-xs text-indigo-500 mt-2 italic">
                Click to generate labels
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

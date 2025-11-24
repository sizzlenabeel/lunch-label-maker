import React from 'react';
import { Search } from 'lucide-react';
import type { ProductSuggestion } from '../../hooks/useProductSuggestions';

interface ProductSearchProps {
  productName: string;
  onProductNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestions: ProductSuggestion[];
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  selectSuggestion: (suggestion: ProductSuggestion) => void;
  selectedProduct: string | null;
  clearSelection: () => void;
}

export function ProductSearch({
  productName,
  onProductNameChange,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  selectSuggestion,
  selectedProduct,
  clearSelection
}: ProductSearchProps) {
  return (
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
            value={productName}
            onChange={onProductNameChange}
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
  );
}
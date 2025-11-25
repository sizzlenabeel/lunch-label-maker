import React from 'react';

interface TranslationSectionProps {
  translatedData: {
    name: string;
    ingredients: string;
    allergens: string;
    consumptionGuidelines: string;
    description: string;
  };
  handleTranslationChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  generateTranslation: () => Promise<void>;
  isTranslating: boolean;
  isEnabled: boolean;
}

export function TranslationSection({
  translatedData,
  handleTranslationChange,
  generateTranslation,
  isTranslating,
  isEnabled
}: TranslationSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">English Translation</h3>
      
      <button
        type="button"
        onClick={generateTranslation}
        disabled={isTranslating || !isEnabled}
        className="mb-6 inline-flex items-center px-4 py-2 border-2 border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
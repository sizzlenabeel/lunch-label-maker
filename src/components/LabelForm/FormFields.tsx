import React from 'react';
import { Leaf, Cookie } from 'lucide-react';

interface FormFieldsProps {
  formData: {
    name: string;
    dueDate: string;
    price: string;
    ingredients: string;
    allergens: string;
    consumptionGuidelines: string;
    description: string;
    fontSize: 'normal' | 'small' | 'smaller';
    weekNumber: string;
    isVegan: boolean;
    isForStorytel: boolean;
    isOnlyForStorytel: boolean;
    deliveryDay: string;
    isSnack: boolean;
  };
  currentWeek: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeliveryDayChange: (day: string) => void;
}

export function FormFields({
  formData,
  currentWeek,
  handleChange,
  handleSelectChange,
  handleCheckboxChange,
  handleDeliveryDayChange
}: FormFieldsProps) {
  const deliveryDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  return (
    <>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price (SEK) {formData.isOnlyForStorytel && <span className="text-gray-500 text-xs">(optional for Storytel-only)</span>}
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
          required={!formData.isOnlyForStorytel}
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

      {/* Snack Option */}
      <div className="flex items-center bg-amber-50 p-3 rounded-lg border border-amber-200">
        <input
          type="checkbox"
          id="isSnack"
          name="isSnack"
          checked={formData.isSnack}
          onChange={handleCheckboxChange}
          className="h-5 w-5 text-amber-600 focus:ring-amber-500 border border-amber-300 rounded"
        />
        <label htmlFor="isSnack" className="ml-2 block text-sm text-amber-700 font-medium flex items-center">
          <Cookie className="w-4 h-4 mr-1" />
          This is a snack (separate labels & menu with prices)
        </label>
      </div>

      {/* Storytel Options - disabled when snack is checked */}
      <div className={`bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-3 ${formData.isSnack ? 'opacity-50' : ''}`}>
        <h3 className="text-sm font-semibold text-purple-900">Storytel Options</h3>
        
        <div className={`flex items-center ${formData.isOnlyForStorytel ? 'opacity-50' : ''}`}>
          <input
            type="checkbox"
            id="isForStorytel"
            name="isForStorytel"
            checked={formData.isForStorytel}
            onChange={handleCheckboxChange}
            disabled={formData.isOnlyForStorytel || formData.isSnack}
            className="h-5 w-5 text-purple-600 focus:ring-purple-500 border border-purple-300 rounded disabled:cursor-not-allowed"
          />
          <label htmlFor="isForStorytel" className="ml-2 block text-sm text-purple-700">
            Also at Storytel (creates both normal and Storytel labels)
          </label>
        </div>

        <div className={`flex items-center ${formData.isForStorytel ? 'opacity-50' : ''}`}>
          <input
            type="checkbox"
            id="isOnlyForStorytel"
            name="isOnlyForStorytel"
            checked={formData.isOnlyForStorytel}
            onChange={handleCheckboxChange}
            disabled={formData.isForStorytel || formData.isSnack}
            className="h-5 w-5 text-purple-600 focus:ring-purple-500 border border-purple-300 rounded disabled:cursor-not-allowed"
          />
          <label htmlFor="isOnlyForStorytel" className="ml-2 block text-sm text-purple-700">
            Only for Storytel (Storytel labels and menu only)
          </label>
        </div>

        {(formData.isForStorytel || formData.isOnlyForStorytel) && !formData.isSnack && (
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Delivery Day (for Storytel Menu) *
            </label>
            <div className="flex flex-wrap gap-2">
              {deliveryDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDeliveryDayChange(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    formData.deliveryDay === day
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
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
            onClick={() => {
              const event = {
                target: {
                  name: 'consumptionGuidelines',
                  value: "Värm upp i mikron i 3 minuter"
                }
              } as React.ChangeEvent<HTMLInputElement>;
              handleChange(event);
            }}
            className="inline-flex items-center px-3 py-1.5 border-2 border-orange-500 shadow-sm text-sm font-medium rounded-md text-orange-500 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Värm i mikron
          </button>
          <button
            type="button"
            onClick={() => {
              const event = {
                target: {
                  name: 'consumptionGuidelines',
                  value: "Ät kall/rumstemperatur"
                }
              } as React.ChangeEvent<HTMLInputElement>;
              handleChange(event);
            }}
            className="inline-flex items-center px-3 py-1.5 border-2 border-orange-500 shadow-sm text-sm font-medium rounded-md text-orange-500 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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
    </>
  );
}
import React, { useState } from 'react';
import { getWeek } from 'date-fns';
import { Leaf } from 'lucide-react';
import { NewWeeklyMenuPDF } from './NewWeeklyMenuPDF';

export function StandardMenuView() {
  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [showVeganOnly, setShowVeganOnly] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'small' | 'smaller'>('normal');

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Standard Weekly Menu</h2>
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

          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as 'normal' | 'small' | 'smaller')}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            <option value="normal">Normal Size</option>
            <option value="small">Small Size</option>
            <option value="smaller">Smaller Size</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          This menu shows all products for week {selectedWeek}, excluding Storytel-only items.
          Both original and English translations are displayed side by side.
        </p>
      </div>

      <NewWeeklyMenuPDF 
        weekNumber={selectedWeek} 
        veganOnly={showVeganOnly}
        fontSize={fontSize}
      />
    </div>
  );
}

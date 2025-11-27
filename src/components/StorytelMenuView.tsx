import React, { useState } from 'react';
import { getWeek } from 'date-fns';
import { StorytelMenuPDF } from './StorytelMenuPDF';

export function StorytelMenuView() {
  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [fontSize, setFontSize] = useState<'normal' | 'small' | 'smaller'>('normal');

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-purple-900">Storytel Weekly Menu</h2>
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

          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as 'normal' | 'small' | 'smaller')}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
          >
            <option value="normal">Normal Size</option>
            <option value="small">Small Size</option>
            <option value="smaller">Smaller Size</option>
          </select>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-purple-800">
          This menu shows all Storytel products organized by delivery day for week {selectedWeek}.
          Only English translations are shown, and prices are not included.
        </p>
      </div>

      <StorytelMenuPDF key={`storytel-menu-${selectedWeek}-${fontSize}`} weekNumber={selectedWeek} fontSize={fontSize} />
    </div>
  );
}

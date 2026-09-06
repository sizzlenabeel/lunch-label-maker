import React from 'react';

export const SLOT_COUNT = 16;

export const allSlots = () => Array(SLOT_COUNT).fill(true) as boolean[];

interface LabelSlotPickerProps {
  slots: boolean[];
  onChange: (slots: boolean[]) => void;
  accent?: 'orange' | 'amber' | 'purple';
}

const accents: Record<string, { on: string; border: string; text: string }> = {
  orange: { on: 'bg-orange-500 border-orange-500 text-white', border: 'border-orange-300', text: 'text-orange-600' },
  amber: { on: 'bg-amber-500 border-amber-500 text-white', border: 'border-amber-300', text: 'text-amber-600' },
  purple: { on: 'bg-purple-500 border-purple-500 text-white', border: 'border-purple-300', text: 'text-purple-600' },
};

export function LabelSlotPicker({ slots, onChange, accent = 'orange' }: LabelSlotPickerProps) {
  const a = accents[accent] ?? accents.orange;
  const selectedCount = slots.filter(Boolean).length;

  const setCount = (n: number) => {
    const clamped = Math.max(0, Math.min(SLOT_COUNT, Math.floor(n || 0)));
    onChange(Array.from({ length: SLOT_COUNT }, (_, i) => i < clamped));
  };

  const toggle = (index: number) => {
    const next = [...slots];
    next[index] = !next[index];
    onChange(next);
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Labels on this sheet</h4>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600" htmlFor="slot-count">
            Number of labels (from top)
          </label>
          <input
            id="slot-count"
            type="number"
            min={1}
            max={SLOT_COUNT}
            value={selectedCount}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-16 text-sm border border-gray-300 rounded px-2 py-1 bg-white"
          />
          <button
            type="button"
            onClick={() => onChange(allSlots())}
            className={`text-xs px-2 py-1 rounded border ${a.border} ${a.text} bg-white hover:bg-white/70`}
          >
            All 16
          </button>
          <button
            type="button"
            onClick={() => onChange(Array(SLOT_COUNT).fill(false))}
            className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 bg-white hover:bg-gray-100"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 max-w-[220px]">
        {Array.from({ length: 8 }).map((_, row) => (
          <React.Fragment key={row}>
            {[row, row + 8].map((index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggle(index)}
                className={`h-6 rounded border text-[10px] transition-colors ${
                  slots[index] ? a.on : 'bg-white border-gray-300 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Empty boxes print blank. Boxes 1-8 are the left column, 9-16 the right column.
      </p>
    </div>
  );
}

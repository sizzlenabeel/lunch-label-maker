import React from 'react';
import { useState } from 'react';
import { LabelForm } from './components/LabelForm';
import { LabelPDF } from './components/LabelPDF';
import { StorytelLabelPDF } from './components/StorytelLabelPDF';
import { ProductsList } from './components/ProductsList';
import { StorytelLabelsView } from './components/StorytelLabelsView';
import { StorytelMenuView } from './components/StorytelMenuView';
import { StandardMenuView } from './components/StandardMenuView';
import { SnackLabelsView } from './components/SnackLabelsView';
import { SnackMenuView } from './components/SnackMenuView';
import type { FoodLabel } from './types';
import { FileText, List, Sparkles, Cookie } from 'lucide-react';

function App() {
  const [labelData, setLabelData] = useState<FoodLabel | null>(null);
  const [activeView, setActiveView] = useState<'form' | 'list' | 'storytel-labels' | 'storytel-menu' | 'standard-menu' | 'snack-labels' | 'snack-menu'>('form');
  const [previewFontSize, setPreviewFontSize] = useState<'normal' | 'small' | 'smaller'>('normal');
  const [activeLabelType, setActiveLabelType] = useState<'standard' | 'storytel'>('standard');

  const handleFormSubmit = (data: FoodLabel) => {
    setLabelData(data);
    // Set default view based on product type
    if (data.isOnlyForStorytel) {
      setActiveLabelType('storytel');
    } else {
      setActiveLabelType('standard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-8">
          <FileText className="h-12 w-12 text-brand mr-4" />
          <h1 className="text-3xl font-bold text-gray-900">
            Sizzle Labels and Menu
          </h1>
        </div>

        {/* Navigation Categories */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {/* Sizzle Category */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-orange-600 mb-2 uppercase tracking-wide">Sizzle</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveView('form');
                  setLabelData(null);
                }}
                className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                  activeView === 'form'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-orange-600 border-orange-400 hover:bg-orange-50'
                }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                Labels
              </button>
              <button
                onClick={() => setActiveView('standard-menu')}
                className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                  activeView === 'standard-menu'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-orange-600 border-orange-400 hover:bg-orange-50'
                }`}
              >
                <List className="h-5 w-5 mr-2" />
                Menu
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                  activeView === 'list'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-orange-600 border-orange-400 hover:bg-orange-50'
                }`}
              >
                <List className="h-5 w-5 mr-2" />
                All Products
              </button>
            </div>
          </div>

          {/* Storytel Category */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">Storytel</span>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('storytel-labels')}
                className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                  activeView === 'storytel-labels'
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-white text-purple-600 border-purple-400 hover:bg-purple-50'
                }`}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Labels
              </button>
              <button
                onClick={() => setActiveView('storytel-menu')}
                className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                  activeView === 'storytel-menu'
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-white text-purple-600 border-purple-400 hover:bg-purple-50'
                }`}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Menu
              </button>
            </div>
          </div>

          {/* Snacks Category */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-amber-600 mb-2 uppercase tracking-wide">Snacks</span>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('snack-labels')}
                className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                  activeView === 'snack-labels'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-amber-600 border-amber-400 hover:bg-amber-50'
                }`}
              >
                <Cookie className="h-5 w-5 mr-2" />
                Labels
              </button>
              <button
                onClick={() => setActiveView('snack-menu')}
                className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                  activeView === 'snack-menu'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-amber-600 border-amber-400 hover:bg-amber-50'
                }`}
              >
                <Cookie className="h-5 w-5 mr-2" />
                Menu
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-0">
          {activeView === 'form' ? (
            !labelData ? (
              <div className="bg-white shadow rounded-lg p-6">
                <LabelForm onSubmit={handleFormSubmit} />
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Generated Labels
                  </h2>
                  <div className="flex items-center gap-4">
                    {labelData.isForStorytel && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveLabelType('standard')}
                          className={`px-3 py-1 rounded border-2 text-sm font-medium transition-colors ${
                            activeLabelType === 'standard'
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50'
                          }`}
                          disabled={labelData.isOnlyForStorytel}
                        >
                          Standard
                        </button>
                        <button
                          onClick={() => setActiveLabelType('storytel')}
                          className={`px-3 py-1 rounded border-2 text-sm font-medium transition-colors ${
                            activeLabelType === 'storytel'
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50'
                          }`}
                        >
                          Storytel
                        </button>
                      </div>
                    )}
                    <select
                      value={previewFontSize}
                      onChange={(e) => setPreviewFontSize(e.target.value as 'normal' | 'small' | 'smaller')}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    >
                      <option value="normal">Normal Size</option>
                      <option value="small">Small Size</option>
                      <option value="smaller">Smaller Size</option>
                    </select>
                    <button
                      onClick={() => setLabelData(null)}
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Create New Labels
                    </button>
                  </div>
                </div>
                {activeLabelType === 'standard' && !labelData.isOnlyForStorytel ? (
                  <LabelPDF data={{ ...labelData, fontSize: previewFontSize }} />
                ) : (
                  <StorytelLabelPDF data={{ ...labelData, fontSize: previewFontSize }} />
                )}
              </div>
            )
          ) : activeView === 'storytel-labels' ? (
            <StorytelLabelsView />
          ) : activeView === 'storytel-menu' ? (
            <StorytelMenuView />
          ) : activeView === 'standard-menu' ? (
            <StandardMenuView />
          ) : activeView === 'snack-labels' ? (
            <SnackLabelsView />
          ) : activeView === 'snack-menu' ? (
            <SnackMenuView />
          ) : (
            <ProductsList />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
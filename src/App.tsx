import React from 'react';
import { useState } from 'react';
import { LabelForm } from './components/LabelForm';
import { LabelPDF } from './components/LabelPDF';
import { StorytelLabelPDF } from './components/StorytelLabelPDF';
import { ProductsList } from './components/ProductsList';
import { StorytelLabelsView } from './components/StorytelLabelsView';
import { StorytelMenuView } from './components/StorytelMenuView';
import { StandardMenuView } from './components/StandardMenuView';
import type { FoodLabel } from './types';
import { FileText, List, Sparkles } from 'lucide-react';

function App() {
  const [labelData, setLabelData] = useState<FoodLabel | null>(null);
  const [activeView, setActiveView] = useState<'form' | 'list' | 'storytel-labels' | 'storytel-menu' | 'standard-menu'>('form');
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

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={() => {
              setActiveView('form');
              setLabelData(null);
            }}
            className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
              activeView === 'form'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50'
            }`}
          >
            <FileText className="h-5 w-5 mr-2" />
            Create Labels
          </button>
          
          <button
            onClick={() => setActiveView('storytel-labels')}
            className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
              activeView === 'storytel-labels'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50'
            }`}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Storytel Labels
          </button>

          <button
            onClick={() => setActiveView('standard-menu')}
            className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
              activeView === 'standard-menu'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50'
            }`}
          >
            <List className="h-5 w-5 mr-2" />
            Standard Menu
          </button>

          <button
            onClick={() => setActiveView('storytel-menu')}
            className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
              activeView === 'storytel-menu'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50'
            }`}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Storytel Menu
          </button>

          <button
            onClick={() => setActiveView('list')}
            className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
              activeView === 'list'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50'
            }`}
          >
            <List className="h-5 w-5 mr-2" />
            All Products
          </button>
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
          ) : (
            <ProductsList />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
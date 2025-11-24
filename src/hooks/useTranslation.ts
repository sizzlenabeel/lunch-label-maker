import { useState } from 'react';
import { translateToEnglish } from '../lib/translation';

interface TranslationData {
  name: string;
  ingredients: string;
  allergens: string;
  consumptionGuidelines: string;
  description: string;
}

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedData, setTranslatedData] = useState<TranslationData>({
    name: '',
    ingredients: '',
    allergens: '',
    consumptionGuidelines: '',
    description: ''
  });
  const [error, setError] = useState<string | null>(null);

  const generateTranslation = async (formData: TranslationData) => {
    try {
      setIsTranslating(true);
      setError(null);
      const translation = await translateToEnglish({
        name: formData.name,
        ingredients: formData.ingredients,
        allergens: formData.allergens,
        consumptionGuidelines: formData.consumptionGuidelines,
        description: formData.description
      });
      setTranslatedData(translation);
    } catch (err) {
      setError('Failed to generate translation. Please try again or enter manually.');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTranslatedData(prev => ({ ...prev, [name]: value }));
  };

  return {
    translatedData,
    setTranslatedData,
    isTranslating,
    error,
    generateTranslation,
    handleTranslationChange
  };
}
import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { format } from 'date-fns';
import JSZip from 'jszip';
import type { FoodLabel } from '../types';

// Fonts (same as existing label components; safe to re-register)
Font.register({ family: 'SF Pro', src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYREGULAR.woff' });
Font.register({ family: 'SF Pro Bold', src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYBOLD.woff' });

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const cmToPoints = (cm: number) => cm * 28.35;
const MARGIN_TOP_BOTTOM = cmToPoints(1.2);
const MARGIN_LEFT_RIGHT = cmToPoints(0.6);
const COLUMN_SPACING = cmToPoints(0.3);
const USABLE_WIDTH = A4_WIDTH - 2 * MARGIN_LEFT_RIGHT;
const LABEL_WIDTH = (USABLE_WIDTH - COLUMN_SPACING) / 2;
const USABLE_HEIGHT = A4_HEIGHT - 2 * MARGIN_TOP_BOTTOM;
const LABEL_HEIGHT = USABLE_HEIGHT / 8;

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: `${MARGIN_TOP_BOTTOM}pt ${MARGIN_LEFT_RIGHT}pt`,
    gap: `${COLUMN_SPACING}pt`,
    fontFamily: 'SF Pro',
  },
  column: { flex: 1, gap: 0 },
  label: {
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    padding: `${cmToPoints(0.2)}pt 10pt 10pt 10pt`,
    border: '1pt solid black',
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  name: { fontSize: 11, fontFamily: 'SF Pro Bold', marginBottom: 4, flex: 1 },
  text: { fontSize: 8, marginBottom: 2 },
  textSmall: { fontSize: 7, marginBottom: 2 },
  textSmaller: { fontSize: 6, marginBottom: 2 },
  allergens: { fontSize: 8, fontFamily: 'SF Pro Bold' },
  allergensSmall: { fontSize: 7, fontFamily: 'SF Pro Bold' },
  allergensSmaller: { fontSize: 6, fontFamily: 'SF Pro Bold' },
  allergensRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  price: { fontSize: 8, fontFamily: 'SF Pro Bold' },
  priceSmall: { fontSize: 7, fontFamily: 'SF Pro Bold' },
  priceSmaller: { fontSize: 6, fontFamily: 'SF Pro Bold' },
  veganIcon: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    fontSize: 8,
    color: '#059669',
    fontFamily: 'SF Pro',
  },
});

type LabelVariant = 'standard' | 'storytel' | 'snack';

function pickVariant(product: any): LabelVariant {
  if (product.is_only_for_storytel) return 'storytel';
  if (product.is_snack) return 'snack';
  return 'standard';
}

function productToLabel(product: any): FoodLabel {
  return {
    name: product.name,
    dueDate: product.due_date,
    price: product.price?.toString() || '',
    ingredients: product.ingredients,
    allergens: product.allergens,
    consumptionGuidelines: product.consumption_guidelines,
    description: product.description,
    fontSize: 'normal',
    weekNumber: product.week_number?.toString() || '',
    isVegan: product.is_vegan,
    isForStorytel: product.is_for_storytel,
    isOnlyForStorytel: product.is_only_for_storytel,
    deliveryDay: product.delivery_day || '',
    isSnack: product.is_snack || false,
  };
}

function textStyle(size: FoodLabel['fontSize']) {
  return size === 'small' ? styles.textSmall : size === 'smaller' ? styles.textSmaller : styles.text;
}
function allergensStyle(size: FoodLabel['fontSize']) {
  return size === 'small'
    ? styles.allergensSmall
    : size === 'smaller'
    ? styles.allergensSmaller
    : styles.allergens;
}
function priceStyle(size: FoodLabel['fontSize']) {
  return size === 'small' ? styles.priceSmall : size === 'smaller' ? styles.priceSmaller : styles.price;
}

function LabelCell({ data, variant }: { data: FoodLabel; variant: LabelVariant }) {
  const t = textStyle(data.fontSize);
  const a = allergensStyle(data.fontSize);
  const p = priceStyle(data.fontSize);
  const formattedDate = data.dueDate ? format(new Date(data.dueDate), 'yyyy-MM-dd') : '';
  const dueText = variant === 'snack' ? 'Best före:' : `Best före: ${formattedDate}`;
  const minWidth = variant === 'snack' ? 120 : 80;

  return React.createElement(
    View,
    { style: styles.label },
    React.createElement(
      View,
      { style: styles.header },
      React.createElement(Text, { style: styles.name, wrap: true }, data.name),
      React.createElement(Text, { style: [t, { minWidth }] }, dueText),
    ),
    React.createElement(Text, { style: t }, `Ingredienser: ${data.ingredients ?? ''}`),
    variant === 'storytel'
      ? React.createElement(Text, { style: a }, `Allergener: ${data.allergens ?? ''}`)
      : React.createElement(
          View,
          { style: styles.allergensRow },
          React.createElement(Text, { style: a }, `Allergener: ${data.allergens ?? ''}`),
          variant === 'snack' && data.price
            ? React.createElement(Text, { style: p }, `${data.price} kr`)
            : null,
        ),
    React.createElement(Text, { style: t }, data.consumptionGuidelines ?? ''),
    React.createElement(Text, { style: t }, data.description ?? ''),
    data.isVegan ? React.createElement(Text, { style: styles.veganIcon }, 'Vegan') : null,
  );
}

function LabelPage({ data, variant }: { data: FoodLabel; variant: LabelVariant }) {
  const cells = Array.from({ length: 8 });
  return React.createElement(
    Page,
    { size: 'A4', style: styles.page },
    React.createElement(
      View,
      { style: styles.column },
      cells.map((_, i) =>
        React.createElement(LabelCell, { key: `L-${i}`, data, variant }),
      ),
    ),
    React.createElement(
      View,
      { style: styles.column },
      cells.map((_, i) =>
        React.createElement(LabelCell, { key: `R-${i}`, data, variant }),
      ),
    ),
  );
}

function singleDocument(product: any) {
  const data = productToLabel(product);
  const variant = pickVariant(product);
  return React.createElement(Document, null, React.createElement(LabelPage, { data, variant }));
}

function combinedDocument(products: any[]) {
  return React.createElement(
    Document,
    null,
    products.map((product, i) => {
      const data = productToLabel(product);
      const variant = pickVariant(product);
      return React.createElement(LabelPage, { key: i, data, variant });
    }),
  );
}

function sanitizeFilename(name: string): string {
  const base = (name || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_]/g, '');
  return base || 'label';
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadLabelsZip(products: any[], zipName: string) {
  const zip = new JSZip();
  const seen = new Map<string, number>();
  for (const product of products) {
    const doc = singleDocument(product);
    
    const blob: Blob = await pdf(doc).toBlob();
    let name = sanitizeFilename(product.name);
    const count = seen.get(name) || 0;
    seen.set(name, count + 1);
    const finalName = count === 0 ? `${name}.pdf` : `${name}-${count + 1}.pdf`;
    zip.file(finalName, blob);
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(zipBlob, zipName);
}

export async function downloadLabelsCombinedPdf(products: any[], fileName: string) {
  const doc = combinedDocument(products);
  
  const blob: Blob = await pdf(doc).toBlob();
  triggerDownload(blob, fileName);
}

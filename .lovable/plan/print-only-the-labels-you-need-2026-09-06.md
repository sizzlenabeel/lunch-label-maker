# Print only the labels you need

Today every label sheet prints all 16 boxes, so a short run wastes most of a sheet. Two additions, both optional — nothing about the current flow changes unless you use them.

## 1. Choose which boxes get printed (single dish)

When a single product's label sheet is open (All Products, Storytel Labels, Snack Labels), a new "Labels on this sheet" panel appears above the preview:

- A number box: choose 1-16. The sheet fills that many boxes counting from the top of the left column, then continues down the right column.
- A small 2x8 grid showing the sheet layout. Click any box to turn it on or off individually, so you can skip boxes already used on a part-printed sheet.
- "All 16" and "Clear" shortcuts.

Boxes that are off render completely blank — no border, no text, no ink — while the filled ones stay in exactly their normal positions so the sticker sheet still lines up.

Default stays all 16.

## 2. Mixed sheet: quantity per dish

A new "Label run" section in the Bulk download panel (All Products, current week):

- Each dish for the selected week gets a quantity box, empty by default.
- Fill in numbers for as many dishes as you like (e.g. 3 of one, 5 of another).
- A running total shows how many labels and how many sheets that makes.
- "Build sheet PDF" produces one PDF that packs the labels in order, 16 per page, filling boxes top-to-bottom left column then right column, across as many pages as needed. The last page leaves the unused boxes blank.
- An option "start each dish on a new page" for when you prefer not to mix dishes on one sheet.

Each dish's labels use its own saved font size (or the existing bulk font-size override).

The existing four bulk buttons, the week filter, and single-dish previews all keep working exactly as they do now.

## Technical notes

- New shared component `src/components/LabelSlotPicker.tsx`: holds a `boolean[16]` selection, a count input that sets the first N slots, click-to-toggle grid cells, All/Clear buttons.
- `LabelPDF.tsx`, `StorytelLabelPDF.tsx`, `SnackLabelPDF.tsx` take a new optional `slots?: boolean[]` prop (default all true). Each column maps index -> the existing `LabelContent` or an empty `View` sized like `styles.label` with no border, preserving layout.
- Slot order is column-major: indices 0-7 left column, 8-15 right column.
- `ProductsList.tsx`, `StorytelLabelsView.tsx`, `SnackLabelsView.tsx` hold `slots` state next to the existing `fontSize` state, render the picker only when a product is selected, and reset to all-on when the selection changes.
- `src/lib/bulkLabels.ts` gains `downloadMixedLabelSheets(entries, fileName, options)` where `entries` is `{ product, quantity }[]`. It flattens into a cell list (product repeated `quantity` times), chunks by 16 (or per-product chunks when `newPagePerProduct`), and renders pages reusing the existing `LabelCell` / column layout with blank filler cells. Existing `downloadLabelsZip` and `downloadLabelsCombinedPdf` signatures are untouched.
- `ProductsList.tsx` adds `quantities: Record<string, number>` state plus the quantity inputs, totals line, and the new build button inside the existing bulk panel.

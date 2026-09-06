# Choose which of the 16 boxes get printed

Today every label sheet prints all 16 boxes, so a small run wastes most of a sheet. This adds a picker so you decide exactly which boxes are filled.

## What you get

When a single product's label sheet is open (All Products, Storytel Labels, Snack Labels), a new "Labels on this sheet" panel appears above the preview:

- A number box: choose 1-16. The sheet fills that many boxes counting from the top of the left column, then continues down the right column.
- A small 2x8 grid showing the sheet layout. Click any box to turn it on or off individually, so you can skip boxes already used on a part-printed sheet.
- "All 16" and "Clear" shortcuts.

Boxes that are off render completely blank — no border, no text, no ink — while the filled ones stay in exactly their normal positions so the sticker sheet still lines up.

Default stays all 16, so nothing changes unless you touch the picker.

Bulk downloads (ZIP / combined PDF) keep printing full sheets; the picker is for the one-sheet-at-a-time case where the saving matters.

## Technical notes

- New shared component `src/components/LabelSlotPicker.tsx`: holds a `boolean[16]` selection, a count input that sets the first N slots, click-to-toggle grid cells, and All/Clear buttons.
- `LabelPDF.tsx`, `StorytelLabelPDF.tsx`, `SnackLabelPDF.tsx` take a new optional `slots?: boolean[]` prop (default all true). Each column maps index -> either the existing `LabelContent` or an empty `View` with the same `width`/`height` as `styles.label` but no border, preserving layout.
- Slot order is column-major: indices 0-7 left column top to bottom, 8-15 right column.
- `ProductsList.tsx`, `StorytelLabelsView.tsx`, `SnackLabelsView.tsx` each hold `slots` state next to the existing `fontSize` state, render the picker when a product is selected, and pass `slots` to the PDF component. Selection resets to all-on when a different product is selected.

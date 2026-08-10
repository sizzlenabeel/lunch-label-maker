# Bulk label downloads: respect font size

Today bulk downloads always render labels at normal size — the generator hardcodes `fontSize: 'normal'` and ignores the product's `font_size` value stored in the database.

## What changes

1. **Use the product's own font size**
   Each label in a ZIP or combined PDF renders with the `font_size` saved on that product (`normal`, `small`, `smaller`). Anything empty or unrecognised falls back to normal.

2. **Add a font-size control to the bulk download panel**
   A small selector next to the bulk buttons with four options:
   - Auto (use each product's saved size) — default
   - Normal
   - Small
   - Smaller

   Picking anything other than Auto overrides the saved value for every label in that download, matching how the individual label view works.

Nothing else about the bulk download flow (grouping, filenames, week filter, buttons) changes.

## Technical notes

- `src/lib/bulkLabels.ts`: `productToLabel` reads `product.font_size` and normalises it; `downloadLabelsZip` / `downloadLabelsCombinedPdf` take an optional `fontSizeOverride` argument threaded down to each label.
- `src/components/ProductsList.tsx`: new local state for the bulk font-size choice, rendered as a select in the bulk panel, passed into both download helpers.

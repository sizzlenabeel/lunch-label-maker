## Bulk Label Download on All Products View

### What Changes

On the **All Products** view, add two pairs of download buttons at the top of the list (respecting the currently selected week):

- **Food labels** (all non-snack products for the selected week)
  - `Download ZIP` — one PDF per dish, filenames = dish name
  - `Download combined PDF` — one multi-page PDF, one label per page
- **Snack labels** (all snack products for the selected week)
  - `Download ZIP` — one PDF per snack
  - `Download combined PDF` — one multi-page PDF

Buttons are disabled while a category has zero products for the week, and show a small "Generating…" state while working.

The vegan filter and the existing product list, menu view, and label preview are **not** changed.

### Behavior Details

- Correct label component per product (same logic already used inline):
  - `is_only_for_storytel` → `StorytelLabelPDF`
  - `is_snack` → `SnackLabelPDF`
  - otherwise → `LabelPDF`
- Filename sanitization: dish name → lowercase, spaces to `-`, strip characters other than `[a-z0-9-_]`, fallback `label-<id>` if empty. `.pdf` appended. Duplicate names get `-2`, `-3` suffixes inside the ZIP.
- Combined PDF filename: `food-labels-week-<N>.pdf` / `snack-labels-week-<N>.pdf`.
- ZIP filename: `food-labels-week-<N>.zip` / `snack-labels-week-<N>.zip`.
- Font size for bulk-generated labels: use `normal` (matches current default).

### Technical Details

**New dependency**
- `jszip` (~30 KB gzipped) for building the ZIP client-side.
- `@react-pdf/renderer` already used in the project exposes `pdf(<Document/>).toBlob()` which we use to render each label to a Blob without mounting it in the DOM.

**New file: `src/lib/bulkLabels.ts`**
- `renderProductLabelBlob(product)` — picks the right PDF component, wraps its `<Document>` output, calls `pdf(...).toBlob()`, returns the Blob.
- `renderCombinedLabelsBlob(products)` — builds one `<Document>` containing each product's `<Page>` (reuses the same three label components' page content) and returns a Blob.
- `downloadZip(products, zipName)` — iterates products, generates each blob, adds to JSZip with a sanitized filename, then triggers browser download via a temporary `<a>` + `URL.createObjectURL`.
- `downloadCombinedPdf(products, fileName)` — renders combined document and triggers download the same way.
- `sanitizeFilename(name)` helper + duplicate-name deduplication.

**Refactor note (minimal):** the three existing label components (`LabelPDF`, `StorytelLabelPDF`, `SnackLabelPDF`) currently render a `<PDFViewer>` for preview. To reuse their page markup for bulk export without breaking the preview, extract each label's page JSX into a small exported function (e.g. `renderLabelPage(data)`) returning the `<Page>` element. The visible components keep working exactly as they do today — they just call the extracted renderer internally. No visual or behavioral change to existing single-label previews.

**File: `src/components/ProductsList.tsx`**
- Add local state: `bulkBusy: 'food-zip' | 'food-pdf' | 'snack-zip' | 'snack-pdf' | null`.
- Derive `foodProducts = products.filter(p => !p.is_snack)` and `snackProducts = products.filter(p => p.is_snack)` from the already-fetched `products` (no extra Supabase queries — vegan filter is intentionally ignored so buttons always cover the full week; matches the "current selected week only" scope).
- Add a `Bulk Download` panel above the product list with 4 buttons, each wired to the helpers above. Buttons are hidden when a label preview is open (`selectedProduct` is set), same pattern as the existing Show Menu button.

No other files change. No backend or schema changes.

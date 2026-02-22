## Add Scroll Position Restore to All Products

### What Changes

1. **Scroll position restore** -- when you click "Back to Product List" after viewing a label, the page scrolls back to where you were in the list instead of jumping to the top.

### Technical Details

**File: `src/components/ProductsList.tsx**`

1. **Save scroll position before viewing a label** -- add a `useRef` for `scrollPositionRef`. When a product is clicked, capture `window.scrollY` (or the container's scroll position) into the ref before setting `selectedProduct`.
2. **Restore scroll position on back** -- when "Back to Product List" is clicked, set `selectedProduct` to null, then use `requestAnimationFrame` (to wait for the list to render) followed by `window.scrollTo(0, savedPosition)` to restore the scroll position.
3. **Add snack badge** to product cards -- show an amber "Snack" badge (similar to the existing Vegan/Storytel badges) when `product.is_snack` is true.

No other files are changed.
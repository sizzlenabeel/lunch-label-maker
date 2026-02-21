

## Add Click-to-View Labels in All Products List

### What Changes
When you click on any product in the "All Products" list, it will show the label preview (just like clicking a product in Storytel Labels), with the correct label type based on the product.

### How It Works
- Click a product to see its label and download it
- Click "Back to Product List" to return to the list
- The correct label type is automatically chosen:
  - **Storytel-only products** show the Storytel label
  - **Snack products** show the Snack label
  - **All other products** show the Standard label
- A font size selector appears when viewing a label

### Technical Details

**File modified: `src/components/ProductsList.tsx`**

1. **Change query to fetch all fields** (`select('*')` instead of specific columns) so we have all the data needed for label generation
2. **Add state**: `selectedProduct` (clicked product) and `fontSize` (label size selector)
3. **Add `convertToLabelData` function** (copied from `StorytelLabelsView`) to convert a database product into a `FoodLabel` object
4. **Make product cards clickable** with `cursor-pointer` and `onClick={() => setSelectedProduct(product)}`
5. **Add "Click to generate labels" hint text** on each product card
6. **Add label view section** (when a product is selected):
   - Show product name, "Back to Product List" button, and font size selector
   - Conditionally render the correct label PDF component:
     - `is_only_for_storytel === true` --> `StorytelLabelPDF`
     - `is_snack === true` --> `SnackLabelPDF`
     - Otherwise --> `LabelPDF`
7. **Import** `LabelPDF`, `StorytelLabelPDF`, `SnackLabelPDF`, and `FoodLabel` type

No other files are changed. The existing menu functionality, filters, and all other views remain untouched.


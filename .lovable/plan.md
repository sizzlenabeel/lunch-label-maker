

## Allow Snacks to Have Storytel Options

### The Problem
When "This is a snack" is checked, both Storytel checkboxes are disabled and cleared. This prevents marking snacks for Storytel, which is needed for the corrected filtering logic we just implemented.

### Changes

**1. `src/components/LabelForm/FormFields.tsx`**
- Remove `formData.isSnack` from the `disabled` condition on both Storytel checkboxes (lines 83-84 and 95-96)
- Remove `formData.isSnack` from the opacity condition on the Storytel section wrapper (line 78)
- Keep the delivery day selector visible when a snack is marked for Storytel

**2. `src/components/LabelForm/index.tsx`**
- Remove the special handling in `handleCheckboxChange` that clears `isForStorytel` and `isOnlyForStorytel` when `isSnack` is checked (lines 113-114)
- Simply set `isSnack` like any other checkbox

No other files change.

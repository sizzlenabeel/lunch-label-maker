# Storytel menu: multi-day delivery groups + vegetarian tag

## What changes

1. **Storytel dishes get multiple delivery days.** Instead of picking one day, you tick any of Monday–Friday for a Storytel dish (e.g. Monday + Tuesday). The existing single-day field stays untouched for Sizzle/standard products.

2. **The Storytel PDF menu groups by day-set.** Dishes that share the exact same ticked days appear together under one heading built from those days: consecutive days render as a range ("Monday-Tuesday", "Wednesday-Thursday"), a single day as "Friday", non-consecutive as a list ("Monday, Thursday"). Groups are ordered by their earliest day. Nothing is hard-coded to 4/4/3 dishes, so the split can change any week.

3. **Vegetarian tag added to all products** (all locations, not just Storytel). New checkbox in the label form next to Vegan. Ticking Vegan implies vegetarian; on menus a dish shows only the strongest tag — "Vegan" if vegan, otherwise "Vegetarian" if marked.

4. **Existing data starts fresh** — no backfill. Storytel dishes will show no day group until days are ticked.

## Where it shows up

- Label form: Storytel section switches from single-day buttons to multi-select day buttons; new Vegetarian checkbox in the dietary section.
- Products list / Storytel labels list: badge shows the ticked days joined, plus a Vegetarian badge where relevant.
- Storytel menu PDF: grouped headings, dish name, description, allergens, and Vegan/Vegetarian tag.
- Standard and Snack menus: gain the Vegetarian tag only; grouping and everything else unchanged.

## Technical notes

- Migration: add `storytel_delivery_days text[]` (default `'{}'`) and `is_vegetarian boolean default false` to `public.products`. Keep `delivery_day` and `sizzle_deliveryday` as-is.
- `productService.ts` and `types.ts` (`FoodLabel`) gain `storytelDeliveryDays: string[]` and `isVegetarian: boolean`; form state and reset defaults updated in `LabelForm/index.tsx`.
- `FormFields.tsx`: day buttons become toggles over an array (existing orange/white styling kept); vegetarian checkbox mirrors the vegan one.
- `StorytelMenuPDF.tsx`: query switches from `.not('delivery_day','is',null)` to selecting `storytel_delivery_days`, filters out empty arrays, groups by a normalized day-key, sorts days Mon→Fri, and renders derived headings; day-section styles reused.
- `StorytelLabelsView.tsx` and `ProductsList.tsx`: display the day array and vegetarian badge.
- No pricing changes; snack and standard menu logic otherwise untouched.

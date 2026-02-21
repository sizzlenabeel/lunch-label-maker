

## Fix Snack Menu Filtering Logic

### The Problem
The current filtering is inverted. The Storytel Snack Menu shows snacks that are NOT marked for Storytel, and the Sizzle Snack Menu shows ALL snacks with no filtering at all.

### Correct Logic

| Snack flags | Sizzle Menu | Storytel Menu |
|---|---|---|
| `is_for_storytel = false`, `is_only_for_storytel = false/null` | Yes | No |
| `is_for_storytel = true` | Yes | Yes |
| `is_only_for_storytel = true` | No | Yes |

### Changes

**1. `src/components/SnackMenuPDF.tsx` (Sizzle Snack Menu)**
- Add filtering to exclude snacks where `is_only_for_storytel = true`
- These are Storytel-exclusive snacks and should not appear in Sizzle
- Fetch `is_only_for_storytel` column and filter: show snack only if `is_only_for_storytel !== true`

**2. `src/components/StorytelSnackMenuPDF.tsx` (Storytel Snack Menu)**
- Fix the inverted filter: change from `is_for_storytel !== true` to `is_for_storytel === true || is_only_for_storytel === true`
- Also fetch `is_only_for_storytel` column
- Update the comments to reflect the corrected logic

No other files change. Menu views, labels, and forms are unaffected.

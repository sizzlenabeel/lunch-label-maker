## Reserve stamp space on snack labels

### Change
In `src/components/SnackLabelPDF.tsx`, inside `LabelContent`, replace the date text with the heading only and reserve more horizontal space for a physical stamp.

- Change `<Text style={[getTextStyle(), { minWidth: 80 }]}>Best före: {formattedDate}</Text>` to render just `Best före:` with `minWidth: 120` (≈50% more room than the current ~80pt date area) so the stamp fits.
- Leave everything else untouched: layout, font sizes, other fields, standard/Storytel labels, menus, and form behavior.

No other files change.
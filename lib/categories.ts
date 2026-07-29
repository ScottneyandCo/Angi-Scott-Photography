// Category values stored in the DB (lowercase) with display labels.
export const CATEGORIES = [
  { value: 'portraits', label: 'Portraits' },
  { value: 'couples', label: 'Couples' },
  { value: 'events', label: 'Events' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'nature', label: 'Nature' },
  { value: 'travel', label: 'Travel' },
] as const

export const CATEGORY_VALUES = CATEGORIES.map((c) => c.value)

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}

// For public filter UI: "All" plus the labels.
export const FILTER_LABELS = ['All', ...CATEGORIES.map((c) => c.label)]

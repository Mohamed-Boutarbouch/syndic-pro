/**
 * Framework-agnostic translation helpers replicating Laravel's `__()` /
 * `trans_choice()` semantics on the frontend, against the flat translation
 * map shared via the `i18n` Inertia prop.
 *
 * Kept separate from the React hook (useTranslation.ts) so the parsing
 * logic can be unit-tested without a component tree.
 */

export type TranslationMap = Record<string, string>;

export type TranslationParams = Record<string, string | number>;

/**
 * Replace Laravel-style `:placeholder` tokens in a translation string.
 *
 * Mirrors Laravel's Translator::makeReplacements: supports case-sensitive
 * matching plus the `:Placeholder` / `:PLACEHOLDER` casing conventions
 * Laravel applies automatically so translators don't need to hand-author
 * every case variant.
 */
export function applyReplacements(line: string, params: TranslationParams = {}): string {
  let result = line;

  for (const [key, value] of Object.entries(params)) {
    const stringValue = String(value);

    result = result
      .replaceAll(`:${key.toUpperCase()}`, stringValue.toUpperCase())
      .replaceAll(`:${capitalize(key)}`, capitalize(stringValue))
      .replaceAll(`:${key}`, stringValue);
  }

  return result;
}

function capitalize(value: string): string {
  return value.length > 0 ? value[0].toUpperCase() + value.slice(1) : value;
}

/**
 * Parse and select the correct segment of a Laravel pluralization string.
 *
 * Laravel's pipe syntax supports three forms, all handled here:
 *   - Simple:      "apple|apples"
 *   - Indexed:     "{0} none|{1} one|[2,*] many"
 *   - Ranges:      "[0,1] none or one|[2,*] many"
 *
 * `[2,*]` means "2 or more" — `*` as a range bound means unbounded.
 */
export function choice(line: string, count: number): string {
  const segments = line.split('|');

  if (segments.length === 1) {
    return segments[0];
  }

  for (const segment of segments) {
    const trimmed = segment.trim();
    const match = trimmed.match(/^(?:\{(\d+)\}|\[(\d+),(\*|\d+)\])\s*(.*)$/s);

    if (!match) {
      continue;
    }

    const [, exact, rangeStart, rangeEnd, text] = match;

    if (exact !== undefined && count === Number(exact)) {
      return text;
    }

    if (rangeStart !== undefined) {
      const start = Number(rangeStart);
      const end = rangeEnd === '*' ? Infinity : Number(rangeEnd);

      if (count >= start && count <= end) {
        return text;
      }
    }
  }

  // Fallback: standard English singular/plural (segment 0 = singular).
  // Flagged assumption — Laravel's own fallback when no range matches
  // uses zero-indexed segments modulo locale plural rules; for the
  // three locales this project ships (en/fr/ar) the simple
  // singular-at-1-else-plural heuristic covers the untagged case.
  const fallbackIndex = count === 1 ? 0 : Math.min(1, segments.length - 1);

  return segments[fallbackIndex].replace(/^(?:\{\d+\}|\[[^\]]+\])\s*/, '').trim();
}

/**
 * Resolve a translation key against the map, falling back to the key
 * itself when missing — matching Laravel's `__()` behavior so untranslated
 * strings are visible (not blank) during development.
 */
export function translate(
  translations: TranslationMap,
  key: string,
  params: TranslationParams = {},
): string {
  const line = translations[key] ?? key;

  return applyReplacements(line, params);
}

/**
 * Resolve a pluralized translation key, applying both choice-selection
 * and placeholder replacement (Laravel auto-injects `:count` from the
 * count argument, matching trans_choice's behavior).
 */
export function translateChoice(
  translations: TranslationMap,
  key: string,
  count: number,
  params: TranslationParams = {},
): string {
  const line = translations[key] ?? key;
  const selected = choice(line, count);

  return applyReplacements(selected, { count, ...params });
}

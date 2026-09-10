import type { Locale } from '@/types/i18n';

/**
 * Intl.NumberFormat locale tags used purely for digit grouping and
 * decimal formatting (NOT for the currency symbol — see CURRENCY_SYMBOL
 * below, since CLDR's built-in MAD symbols don't match what we want
 * displayed per-locale: "MAD" / "DH" / "د.م").
 *
 * Note: ar-MA groups digits with "." and decimals with "," (French-style
 * punctuation), which is correct CLDR behavior for Morocco — not a bug.
 */
const NUMBER_LOCALE_MAP: Record<Locale, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  ar: 'ar-MA',
};

const CURRENCY_SYMBOL: Record<Locale, string> = {
  en: 'MAD',
  fr: 'DH',
  ar: 'د.م',
};

// true = symbol goes first in logical/reading order (before the number)
const SYMBOL_BEFORE: Record<Locale, boolean> = {
  en: false,
  fr: false,
  ar: true,
};

export interface FormatCurrencyOptions {
  /** Override the default 2 decimal places. */
  decimals?: number;
  /** Omit the currency symbol, return just the formatted number. */
  numberOnly?: boolean;
}

/**
 * Formats a numeric value as Moroccan Dirham, with symbol placement and
 * digit grouping localized per app locale:
 *   en: "1,000.00 MAD"
 *   fr: "1 000,00 DH"
 *   ar: "د.م 1.000,00"  (symbol leads, in logical order — wrap in dir="rtl")
 */
export function formatCurrency(
  value: number,
  locale: Locale,
  options: FormatCurrencyOptions = {},
): string {
  const { decimals = 2, numberOnly = false } = options;

  const formattedNumber = new Intl.NumberFormat(NUMBER_LOCALE_MAP[locale], {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  if (numberOnly) {
    return formattedNumber;
  }

  const symbol = CURRENCY_SYMBOL[locale];

  return SYMBOL_BEFORE[locale] ? `${symbol} ${formattedNumber}` : `${formattedNumber} ${symbol}`;
}

import type { Locale } from '@/types/i18n';

const CURRENCY_CONFIG: Record<
  Locale,
  {
    locale: string;
    currencyDisplay: 'symbol' | 'code' | 'name';
  }
> = {
  en: {
    locale: 'en-MA',
    currencyDisplay: 'code',
  },
  fr: {
    locale: 'fr-MA',
    currencyDisplay: 'code',
  },
  ar: {
    locale: 'ar-MA',
    currencyDisplay: 'code',
  },
};

export function formatCurrency(value: number, locale: Locale): string {
  const config = CURRENCY_CONFIG[locale];

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: 'MAD',
    currencyDisplay: config.currencyDisplay,
  }).format(value);
}

import { usePage } from '@inertiajs/react';
import { useCallback } from 'react';

import { formatCurrency } from '@/lib/currency';
import type { FormatCurrencyOptions } from '@/lib/currency';
import { translate, translateChoice } from '@/lib/translate';

import type { TranslationParams } from '@/lib/translate';
import type { I18nSharedProps, Locale } from '@/types/i18n';

export type TFunction = (key: string, params?: TranslationParams) => string;
export type TChoiceFunction = (key: string, count: number, params?: TranslationParams) => string;
export type MoneyFunction = (value: number, options?: FormatCurrencyOptions) => string;

interface UseTranslationResult {
  t: TFunction;
  tChoice: TChoiceFunction;
  money: MoneyFunction;
  locale: Locale;
  isRtl: boolean;
}

const RTL_LOCALES: ReadonlySet<Locale> = new Set(['ar']);

export function useTranslation(namespace?: string): UseTranslationResult {
  const { i18n } = usePage<{ i18n: I18nSharedProps }>().props;

  const prefix = namespace ? `${namespace}.` : '';

  const t = useCallback(
    (key: string, params?: TranslationParams) =>
      translate(i18n.translations, `${prefix}${key}`, params),
    [i18n.translations, prefix],
  );

  const tChoice = useCallback(
    (key: string, count: number, params?: TranslationParams) =>
      translateChoice(i18n.translations, `${prefix}${key}`, count, params),
    [i18n.translations, prefix],
  );

  const money = useCallback(
    (value: number, options?: FormatCurrencyOptions) => formatCurrency(value, i18n.locale, options),
    [i18n.locale],
  );

  return {
    t,
    tChoice,
    money,
    locale: i18n.locale,
    isRtl: RTL_LOCALES.has(i18n.locale),
  };
}

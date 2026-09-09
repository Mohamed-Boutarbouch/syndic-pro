import { usePage } from '@inertiajs/react';
import { useCallback } from 'react';

import { translate, translateChoice } from '@/lib/translate';

import type { TranslationParams } from '@/lib/translate';
import type { I18nSharedProps, Locale } from '@/types/i18n';

export type TFunction = (key: string, params?: TranslationParams) => string;

export type TChoiceFunction = (key: string, count: number, params?: TranslationParams) => string;

interface UseTranslationResult {
  t: (key: string, params?: TranslationParams) => string;
  tChoice: (key: string, count: number, params?: TranslationParams) => string;
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

  return {
    t,
    tChoice,
    locale: i18n.locale,
    isRtl: RTL_LOCALES.has(i18n.locale),
  };
}

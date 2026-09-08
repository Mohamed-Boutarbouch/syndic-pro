import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';

import { translate, translateChoice } from '@/lib/translate';

import type { TranslationParams } from '@/lib/translate';
import type { I18nSharedProps, Locale } from '@/types/i18n';

interface UseTranslationResult {
    t: (key: string, params?: TranslationParams) => string;
    tChoice: (key: string, count: number, params?: TranslationParams) => string;
    locale: Locale;
    /** True for locales rendered right-to-left; feed into `dir` attributes. */
    isRtl: boolean;
}

const RTL_LOCALES: ReadonlySet<Locale> = new Set(['ar']);

/**
 * Primary translation hook for page/layout components.
 *
 * Reads the `i18n` prop shared by HandleInertiaRequests on every request,
 * so no provider/context wrapper is needed — consistent with how this
 * project already reads `auth` off usePage() directly.
 *
 * Usage:
 *   const { t, tChoice } = useTranslation();
 *   t('Transfer administrative role to :name?', { name: coOwner.name })
 *   tChoice('{0} No payments recorded|{1} :count payment recorded|[2,*] :count payments recorded', payments.length)
 */
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
            translateChoice(
                i18n.translations,
                `${prefix}${key}`,
                count,
                params,
            ),
        [i18n.translations, prefix],
    );

    const isRtl = useMemo(() => RTL_LOCALES.has(i18n.locale), [i18n.locale]);

    return {
        t,
        tChoice,
        locale: i18n.locale,
        isRtl,
    };
}

export type Locale = 'en' | 'fr' | 'ar';

export interface I18nSharedProps {
    locale: Locale;
    fallback: Locale;
    /**
     * Flat key -> translation string map for the active locale, as
     * serialized from lang/{locale}.json. Pipe-delimited values
     * (e.g. "{0} ...|{1} ...") are Laravel pluralization strings —
     * see lib/translate.ts's `choice()` for how they're parsed.
     */
    translations: Record<string, string>;
}

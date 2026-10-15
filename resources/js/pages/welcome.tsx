import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Languages, Monitor, Moon, Sun } from 'lucide-react';

import updateLocale from '@/actions/App/Http/Controllers/Settings/UpdateLocaleController';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import type { Appearance } from '@/hooks/use-appearance';
import { useTranslation } from '@/hooks/use-translation';
import { login, register } from '@/routes';
import type { Locale } from '@/types/i18n';

const splits = [
  { key: 'karim', paid: 600, due: 600 },
  { key: 'salma', paid: 300, due: 400 },
  { key: 'youssef', paid: 0, due: 200 },
];

const featureIds = ['fair_shares', 'billing', 'ledger', 'stable_budgets'] as const;

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

const primaryBtn = `inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 ${focus}`;

const ghostBtn = `inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${focus}`;

const iconBtn = `inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${focus}`;

const LOCALES: ReadonlyArray<{
  code: Locale;
  label: string;
}> = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
];

const THEMES: ReadonlyArray<{
  value: Appearance;
  label: string;
  icon: typeof Sun;
}> = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function Welcome() {
  const { auth } = usePage().props;
  const { t, locale } = useTranslation();
  const { appearance, updateAppearance } = useAppearance();

  const totalPaid = splits.reduce((sum, split) => sum + split.paid, 0);
  const totalDue = splits.reduce((sum, split) => sum + split.due, 0);

  const { put, processing, transform } = useForm<{
    locale: Locale;
  }>({
    locale,
  });

  const handleLocaleChange = (nextLocale: Locale) => {
    if (nextLocale === locale || processing) {
      return;
    }

    transform(() => ({
      locale: nextLocale,
    }));

    put(updateLocale.url(), {
      preserveScroll: true,
      preserveState: false,
    });
  };

  return (
    <>
      <Head title={t('welcome.meta_title')} />

      <div className="min-h-screen bg-background text-foreground">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Link
            href="/"
            className="inline-flex min-w-0 shrink items-center gap-2 font-heading text-3xl font-bold tracking-tight"
          >
            <img
              src="/logo.png"
              alt=""
              aria-hidden="true"
              className="size-10 shrink-0 object-contain sm:size-12"
            />

            <span dir="ltr" className="whitespace-nowrap">
              <span className="text-foreground">Syndic</span>
              <span className="text-[#4338CA]">Pro</span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Theme switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={iconBtn}
                aria-label="Change theme"
                title="Change theme"
              >
                {appearance === 'light' && <Sun className="size-4" />}
                {appearance === 'dark' && <Moon className="size-4" />}
                {appearance === 'system' && <Monitor className="size-4" />}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {THEMES.map(({ value, label, icon: Icon }) => (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className="cursor-pointer"
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>

                    {appearance === value && (
                      <span className="ms-auto text-xs text-muted-foreground">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Locale switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={iconBtn}
                aria-label={t('user_menu.language')}
                title={t('user_menu.language')}
                disabled={processing}
              >
                <Languages className="size-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {LOCALES.map(({ code, label }) => (
                  <DropdownMenuItem
                    key={code}
                    disabled={processing || code === locale}
                    onClick={() => handleLocaleChange(code)}
                    className="cursor-pointer"
                  >
                    <span>{label}</span>

                    {code === locale && (
                      <span className="ms-auto text-xs text-muted-foreground">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Authentication actions */}
            {auth.user ? (
              <Link href="/onboarding/property" className={`${primaryBtn} px-3 sm:px-5`}>
                {t('welcome.nav.continue')}
              </Link>
            ) : (
              <>
                <Link href={login()} className={`${ghostBtn} hidden px-3 sm:inline-flex sm:px-5`}>
                  {t('welcome.nav.login')}
                </Link>

                <Link href={register()} className={`${primaryBtn} px-3 sm:px-5`}>
                  <span className="sm:hidden">{t('welcome.nav.get_started')}</span>
                  <span className="hidden sm:inline">{t('welcome.nav.get_started')}</span>
                </Link>
              </>
            )}
          </nav>
        </header>

        <main>
          {/* Hero */}
          <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-12 pb-20 lg:grid-cols-2 lg:pt-20">
            <div>
              <h1 className="max-w-xl font-heading text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
                {t('welcome.hero.title')}
              </h1>

              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                {t('welcome.hero.subtitle')}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={auth.user ? '/onboarding/property' : register()} className={primaryBtn}>
                  {auth.user ? t('welcome.nav.continue') : t('welcome.hero.cta_create')}
                </Link>

                {!auth.user && (
                  <Link href={login()} className={ghostBtn}>
                    {t('welcome.hero.cta_login')}
                  </Link>
                )}
              </div>
            </div>

            {/* Sample installment */}
            <div
              className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm"
              aria-label={t('welcome.sample.aria_label')}
            >
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-medium">{t('welcome.sample.unit')}</p>
                  <p className="text-sm text-muted-foreground">{t('welcome.sample.installment')}</p>
                </div>

                <p className="text-end font-heading text-2xl font-semibold tabular-nums">
                  {totalDue.toLocaleString('en-US')}

                  <span className="ms-1 font-sans text-sm font-normal text-muted-foreground">
                    {t('welcome.sample.currency')}
                  </span>
                </p>
              </div>

              <ul className="mt-6 space-y-4">
                {splits.map((split) => {
                  const pct = Math.round((split.paid / split.due) * 100);

                  const name = t(`welcome.sample.payers.${split.key}`);

                  return (
                    <li key={split.key}>
                      <div className="mb-1.5 flex justify-between gap-4 text-sm">
                        <span>{name}</span>

                        <span className="text-muted-foreground tabular-nums">
                          {split.paid} / {split.due} {t('welcome.sample.currency')}
                        </span>
                      </div>

                      <div
                        className="h-2 overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={t('welcome.sample.progress_label', {
                          name,
                          percent: pct,
                        })}
                      >
                        <div
                          className={`h-full rounded-full ${
                            pct === 100 ? 'bg-primary' : 'bg-chart-2'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
                {t('welcome.sample.summary', {
                  paid: totalPaid,
                  total: totalDue,
                  remaining: totalDue - totalPaid,
                })}
              </p>
            </div>
          </section>

          {/* Features */}
          <section className="border-t border-border bg-muted/40">
            <div className="mx-auto max-w-6xl px-6 py-16">
              <h2 className="max-w-lg font-heading text-2xl font-semibold tracking-tight">
                {t('welcome.features.heading')}
              </h2>

              <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
                {featureIds.map((id) => (
                  <div key={id} className="border-t border-border pt-4">
                    <dt className="font-medium">{t(`welcome.features.${id}.title`)}</dt>

                    <dd className="mt-2 leading-relaxed text-muted-foreground">
                      {t(`welcome.features.${id}.body`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Call to action */}
          <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-primary px-8 py-10 text-primary-foreground sm:flex-row sm:items-center">
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight">
                  {t('welcome.cta.title')}
                </h2>

                <p className="mt-1 opacity-80">{t('welcome.cta.subtitle')}</p>
              </div>

              <Link
                href={auth.user ? '/onboarding/property' : register()}
                className={`inline-flex shrink-0 items-center rounded-md bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background/90 ${focus}`}
              >
                {auth.user ? t('welcome.nav.continue') : t('welcome.nav.get_started')}
              </Link>
            </div>
          </section>
        </main>

        <footer className="mx-auto max-w-6xl px-6 pb-10 text-sm text-muted-foreground">
          {t('welcome.footer.copyright', {
            year: new Date().getFullYear(),
          })}
        </footer>
      </div>
    </>
  );
}

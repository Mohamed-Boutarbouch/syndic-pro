import { Link, router, useForm } from '@inertiajs/react';
import { Languages, LogOut, Monitor, Moon, Sun } from 'lucide-react';

import updateLocale from '@/actions/App/Http/Controllers/Settings/UpdateLocaleController';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useTranslation } from '@/hooks/use-translation';
import { logout } from '@/routes';
import type { User } from '@/types';
import type { Locale } from '@/types/i18n';

type Props = {
  user: User;
};

const LOCALES: ReadonlyArray<{
  code: Locale;
  emoji: string;
  nativeLabel: string;
}> = [
  {
    code: 'en',
    emoji: '🇬🇧',
    nativeLabel: 'English',
  },
  {
    code: 'fr',
    emoji: '🇫🇷',
    nativeLabel: 'Français',
  },
  {
    code: 'ar',
    emoji: '🇲🇦',
    nativeLabel: 'العربية',
  },
];

export function OnboardingMenuContext({ user }: Props) {
  const cleanup = useMobileNavigation();
  const { locale, t } = useTranslation('onboarding');

  const { appearance, updateAppearance } = useAppearance();

  const THEMES: ReadonlyArray<{
    value: Appearance;
    label: string;
    icon: typeof Sun;
  }> = [
    { value: 'light', label: t('theme.light'), icon: Sun },
    { value: 'dark', label: t('theme.dark'), icon: Moon },
    { value: 'system', label: t('theme.system'), icon: Monitor },
  ];

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

  const handleLogout = () => {
    cleanup();
    router.flushAll();
  };

  const currentLocale = LOCALES.find((item) => item.code === locale);

  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserInfo user={user} showEmail={true} />
          </div>
        </DropdownMenuLabel>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            {appearance === 'light' && <Sun className="mr-2 size-4" />}
            {appearance === 'dark' && <Moon className="mr-2 size-4" />}
            {appearance === 'system' && <Monitor className="mr-2 size-4" />}

            <span>{t('theme.label')}</span>

            <span className="ml-auto text-muted-foreground capitalize">{appearance}</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            {THEMES.map(({ value, label, icon: Icon }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => updateAppearance(value)}
                className="cursor-pointer"
              >
                <Icon className="mr-2 size-4" />
                <span>{label}</span>

                {appearance === value && (
                  <span className="ml-auto text-xs text-muted-foreground">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={processing} className="cursor-pointer">
            <Languages className="mr-2" />
            <span>{t('language.label')}</span>

            <span className="ml-auto text-muted-foreground">{currentLocale?.nativeLabel}</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            {LOCALES.map((item) => (
              <DropdownMenuItem
                key={item.code}
                disabled={processing || item.code === locale}
                onClick={() => handleLocaleChange(item.code)}
                className="cursor-pointer"
              >
                <span>
                  {item.emoji} {item.nativeLabel}
                </span>

                {item.code === locale && (
                  <span className="ml-auto text-xs text-muted-foreground">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        render={
          <Link href={logout()} as="button" onClick={handleLogout} data-test="logout-button" />
        }
        nativeButton
        className="w-full cursor-pointer"
      >
        <LogOut className="mr-2" />
        {t('user_menu.logout')}
      </DropdownMenuItem>
    </>
  );
}

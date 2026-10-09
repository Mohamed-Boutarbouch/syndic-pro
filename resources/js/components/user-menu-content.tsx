import { Link, router, useForm } from '@inertiajs/react';
import { Languages, LogOut, Settings } from 'lucide-react';

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
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useTranslation } from '@/hooks/use-translation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
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

export function UserMenuContent({ user }: Props) {
  const cleanup = useMobileNavigation();
  const { locale, t } = useTranslation();

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
        <DropdownMenuItem
          render={<Link href={edit()} prefetch onClick={cleanup} />}
          className="cursor-pointer"
        >
          <Settings className="mr-2" />
          {t('user_menu.settings')}
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={processing} className="cursor-pointer">
            <Languages className="mr-2" />
            <span>{t('user_menu.language')}</span>

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

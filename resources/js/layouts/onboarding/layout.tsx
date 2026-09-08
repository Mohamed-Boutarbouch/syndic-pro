import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';
import { Stepper } from '@/components/onboarding/stepper';
import { home } from '@/routes';

export default function OnboardingLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-center">
            <Link
              href={home()}
              className="flex items-center gap-2 font-semibold tracking-tight"
              aria-label="SyndicPro home"
            >
              <AppLogoIcon className="size-7 fill-current text-foreground" />
              <span>SyndicPro</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 bg-muted">
        <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl">
            <Stepper />

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

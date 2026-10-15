import type { PropsWithChildren } from 'react';

import { Stepper } from '@/components/onboarding/stepper';
import { OnboardingUserMenu } from '@/components/onboarding/user-menu';
import { useTranslation } from '@/hooks/use-translation';

export default function OnboardingLayout({ children }: PropsWithChildren) {
  const { isRtl } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between">
            <div className="inline-flex items-center gap-2 font-heading text-xl font-bold tracking-tight">
              <img src="/logo.png" alt="" aria-hidden="true" className="size-8 object-contain" />
              <span>
                <span className="text-foreground">Syndic</span>
                <span className="text-[#4338CA]">Pro</span>
              </span>
            </div>

            <OnboardingUserMenu />
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

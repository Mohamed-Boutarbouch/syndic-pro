import { ReactNode } from 'react';
import Link from 'next/link';

import { OnboardingFooter } from '@/components/onboarding/onboarding-footer';

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-center">
            <Link
              href="/"
              className="font-semibold tracking-tight"
              aria-label="SyndicPro home"
            >
              SyndicPro
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1">
        <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl">{children}</div>
        </div>
      </main>

      <OnboardingFooter />
    </div>
  );
}

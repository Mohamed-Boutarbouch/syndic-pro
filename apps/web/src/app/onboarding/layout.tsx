import { ReactNode } from 'react';
import Link from 'next/link';

import { Footer } from '@/components/onboarding/footer';
import { Stepper } from '@/components/onboarding/stepper';

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

      <main className="flex flex-1 bg-muted">
        <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl">
            <Stepper />
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { Link } from '@inertiajs/react';

import { useTranslation } from '@/hooks/use-translation';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4">
            <Link
              href={home()}
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

            <div className="space-y-2 text-center">
              <h1 className="text-xl font-medium">{title ? t(title) : null}</h1>
              <p className="text-center text-sm text-muted-foreground">
                {description ? t(description) : null}
              </p>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import { Building2, Calendar, Home, Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { href: '/onboarding/property', label: 'Property', icon: Building2 },
  { href: '/onboarding/fiscal-year', label: 'Fiscal Year', icon: Calendar },
  { href: '/onboarding/units', label: 'Units', icon: Home },
  { href: '/onboarding/co-owners', label: 'Co-Owners', icon: Users },
] as const;

export function OnboardingStepper() {
  const pathname = usePathname();
  const currentIndex = steps.findIndex((s) => s.href === pathname);

  if (currentIndex === -1) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl items-center pb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isLast = index === steps.length - 1;
        const Icon = step.icon;

        return (
          <div
            key={step.href}
            className="flex flex-1 items-center last:flex-initial"
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2',
                  isCompleted &&
                    'border-primary bg-primary text-primary-foreground',
                  isActive && 'border-primary text-primary',
                  !isCompleted &&
                    !isActive &&
                    'border-muted-foreground/30 text-muted-foreground',
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  'text-xs whitespace-nowrap',
                  isActive
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  'mx-2 mb-5 h-0.5 flex-1',
                  isCompleted ? 'bg-primary' : 'bg-muted-foreground/30',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

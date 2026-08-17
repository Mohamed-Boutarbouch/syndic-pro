'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

const steps = {
  '/onboarding/property': {
    formId: 'onboarding-property-form',
    backHref: undefined,
    submitLabel: 'Continue',
    submitIcon: ArrowRight,
  },
  '/onboarding/fiscal-year': {
    formId: 'onboarding-fiscal-year-form',
    backHref: '/onboarding/property',
    submitLabel: 'Continue',
    submitIcon: ArrowRight,
  },
  '/onboarding/units': {
    formId: 'onboarding-units-form',
    backHref: '/onboarding/fiscal-year',
    submitLabel: 'Continue',
    submitIcon: ArrowRight,
  },
  '/onboarding/co-owners': {
    formId: 'onboarding-co-owners-form',
    backHref: '/onboarding/units',
    submitLabel: 'Complete setup',
    submitIcon: Check,
  },
} as const;

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const step = steps[pathname as keyof typeof steps];

  const SubmitIcon = step.submitIcon;

  if (!step) {
    return null;
  }

  function handleBack() {
    if (step.backHref) {
      router.push(step.backHref);
    }
  }

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={!step.backHref}
          >
            <ArrowLeft data-icon="inline-start" />
            Back
          </Button>

          <Button type="submit" form={step.formId}>
            {step.submitLabel}
            <SubmitIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </footer>
  );
}

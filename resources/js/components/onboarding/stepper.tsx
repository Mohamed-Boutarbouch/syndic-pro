import { usePage } from '@inertiajs/react';
import { Building2, Calendar, Check, Home, Users } from 'lucide-react';

import { cn } from '@/lib/utils';

const steps = [
    {
        match: '/onboarding/property',
        label: 'Property',
        icon: Building2,
    },
    {
        match: '/onboarding/property/:property/budget',
        label: 'Fiscal Year',
        icon: Calendar,
    },
    {
        match: '/onboarding/property/:property/units',
        label: 'Units',
        icon: Home,
    },
    {
        match: '/onboarding/property/:property/co-owners',
        label: 'Co-Owners',
        icon: Users,
    },
] as const;

export function Stepper() {
    const { url } = usePage();

    const pathname = new URL(url, window.location.origin).pathname;

    const currentIndex = (() => {
        if (/^\/onboarding\/property\/\d+\/budget$/.test(pathname)) {
            return 1;
        }

        if (/^\/onboarding\/property\/\d+\/units$/.test(pathname)) {
            return 2;
        }

        if (/^\/onboarding\/property\/\d+\/co-owners$/.test(pathname)) {
            return 3;
        }

        if (pathname === '/onboarding/property') {
            return 0;
        }

        return -1;
    })();

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
                        key={step.match}
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
                                    <Check className="size-4" />
                                ) : (
                                    <Icon className="size-4" />
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
                                    isCompleted
                                        ? 'bg-primary'
                                        : 'bg-muted-foreground/30',
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

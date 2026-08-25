import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';

type OnboardingLayoutProps = PropsWithChildren<{
    title?: string;
    description?: string;
    step?: number;
    totalSteps?: number;
}>;

export default function OnboardingLayout({
    children,
    title,
    description,
    step,
    totalSteps,
}: OnboardingLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center bg-background p-6 md:p-10">
            <div className="w-full max-w-xl">
                <div className="mb-8 flex flex-col items-center gap-4">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 font-medium"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-md">
                            <AppLogoIcon className="size-9 fill-current text-foreground" />
                        </div>
                    </Link>

                    {step && totalSteps && (
                        <div className="flex w-full max-w-xs items-center gap-1.5">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 flex-1 rounded-full ${
                                        i < step ? 'bg-primary' : 'bg-muted'
                                    }`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="space-y-1 text-center">
                        {title && (
                            <h1 className="text-xl font-medium">{title}</h1>
                        )}
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
}

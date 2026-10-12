import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = {
  children: ReactNode;
  variant?: AppVariant;
};

type SharedProps = {
  sidebarOpen: boolean;
  currentBudget: {
    id: number;
    isLocked: boolean;
    startDate: string;
    endDate: string;
  } | null;
};

export function AppShell({ children, variant = 'sidebar' }: Props) {
  const { sidebarOpen } = usePage<SharedProps>().props;

  if (variant === 'header') {
    return <div className="flex min-h-screen w-full flex-col">{children}</div>;
  }

  return <SidebarProvider defaultOpen={sidebarOpen}>{children}</SidebarProvider>;
}

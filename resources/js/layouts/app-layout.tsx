import { AppDirection } from '@/components/app-direction';
import { useTranslation } from '@/hooks/use-translation';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
  breadcrumbs = [],
  children,
}: {
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
}) {
  const { isRtl } = useTranslation();

  return (
    <AppDirection direction={isRtl ? 'rtl' : 'ltr'}>
      <AppLayoutTemplate breadcrumbs={breadcrumbs}>{children}</AppLayoutTemplate>
    </AppDirection>
  );
}

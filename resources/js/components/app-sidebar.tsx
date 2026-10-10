import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Building2, LayoutGrid, ReceiptText, Wallet } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTranslation } from '@/hooks/use-translation';

import type { NavItem } from '@/types';

type SharedProps = {
  currentProperty: {
    id: string;
    name: string;
  } | null;
};

export function AppSidebar() {
  const { currentProperty } = usePage<SharedProps>().props;
  const { isRtl, t } = useTranslation();

  const mainNavItems: NavItem[] = [
    { title: t('navigation.dashboard'), href: '/dashboard', icon: LayoutGrid },
    { title: t('navigation.financial_budget'), href: '/budget', icon: Wallet },
    { title: t('navigation.co_owners'), href: '/co-owners', icon: Building2 },
    { title: t('navigation.billing'), href: '/billing', icon: ReceiptText },
    { title: t('navigation.ledger'), href: '/ledger', icon: BookOpen },
  ];

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      side={isRtl ? 'right' : 'left'}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={currentProperty ? <Link href="/dashboard" prefetch /> : undefined}
            >
              <AppLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

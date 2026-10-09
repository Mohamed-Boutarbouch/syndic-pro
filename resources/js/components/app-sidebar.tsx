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
  property: {
    id: string;
    name: string;
  };
};

export function AppSidebar() {
  const { property } = usePage<SharedProps>().props;
  const { isRtl, t } = useTranslation();

  const mainNavItems: NavItem[] = [
    {
      title: t('navigation.dashboard'),
      href: `/properties/${property.id}/dashboard`,
      icon: LayoutGrid,
    },
    {
      title: t('navigation.financial_budget'),
      href: `/properties/${property.id}/budget`,
      icon: Wallet,
    },
    {
      title: t('navigation.co_owners'),
      href: `/properties/${property.id}/co-owners`,
      icon: Building2,
    },
    {
      title: t('navigation.billing'),
      href: `/properties/${property.id}/billing`,
      icon: ReceiptText,
    },
    {
      title: t('navigation.ledger'),
      href: `/properties/${property.id}/ledger`,
      icon: BookOpen,
    },
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
              render={<Link href={`/properties/${property.id}/dashboard`} prefetch />}
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

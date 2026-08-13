'use client';

import { ComponentProps, useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  BookOpen,
  Building,
  Building2,
  Command,
  LayoutDashboard,
  ReceiptText,
  Settings,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

import { NavManagements } from '@/components/layout/nav-managements';
import { NavSecondary } from '@/components/layout/nav-secondary';
import { NavUser } from '@/components/layout/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { PropertySwitcher } from './property-switcher';

const user = {
  name: 'shadcn',
  email: 'm@example.com',
  avatar: '/avatars/shadcn.jpg',
};
const properties = [
  {
    name: 'Résidence Al Andalus',
    logo: Building,
    city: 'Fes',
  },
  {
    name: 'Résidence Al Houda',
    logo: Building,
    city: 'Casablanca',
  },
];

const navSecondary = [
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const params = useParams<{ propertyId: string }>();
  const propertyId = params?.propertyId ?? '1';

  const managements = useMemo(
    () => [
      {
        name: 'Dashboard',
        url: `/properties/${propertyId}`,
        icon: LayoutDashboard,
      },
      {
        name: 'Financial Budget',
        url: `/properties/${propertyId}/budget`,
        icon: Wallet,
      },
      {
        name: 'Co-Owners',
        url: `/properties/${propertyId}/co-owners`,
        icon: Building2,
      },
      {
        name: 'Billing',
        url: `/properties/${propertyId}/billing`,
        icon: ReceiptText,
      },
      {
        name: 'Ledger',
        url: `/properties/${propertyId}/ledger`,
        icon: BookOpen,
      },
    ],
    [propertyId],
  );
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link href={`/properties/${propertyId}`}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">SyndicPro</span>
                    <span className="truncate text-xs">Manager</span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <PropertySwitcher properties={properties} />
        <NavManagements managements={managements} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

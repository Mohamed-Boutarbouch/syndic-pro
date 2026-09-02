import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    FolderGit2,
    LayoutGrid,
    ReceiptText,
    Wallet,
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
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
import type { NavItem } from '@/types';

type SharedProps = {
    property: {
        id: number;
        name: string;
    };
};

export function AppSidebar() {
    const { property } = usePage<SharedProps>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: `/properties/${property.id}/dashboard`,
            icon: LayoutGrid,
        },
        {
            title: 'Financial Budget',
            href: `/properties/${property.id}/budget`,
            icon: Wallet,
        },
        {
            title: 'Co-Owners',
            href: `/properties/${property.id}/co-owners`,
            icon: Building2,
        },
        {
            title: 'Billing',
            href: `/properties/${property.id}/billing`,
            icon: ReceiptText,
        },
        {
            title: 'Ledger',
            href: `/properties/${property.id}/ledger`,
            icon: BookOpen,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            render={
                                <Link
                                    href={`/properties/${property.id}/dashboard`}
                                    prefetch
                                />
                            }
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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

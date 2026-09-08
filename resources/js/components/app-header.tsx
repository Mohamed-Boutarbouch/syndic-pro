import { Link, usePage } from '@inertiajs/react';
import { Search, Menu } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import type { BreadcrumbItem } from '@/types';

type Props = {
  breadcrumbs?: BreadcrumbItem[];
};

export function AppHeader({ breadcrumbs = [] }: Props) {
  const page = usePage();
  const { auth } = page.props;

  return (
    <>
      <div className="border-b border-sidebar-border/80">
        <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" className="mr-2 h-8.5 w-8.5" />}
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
              >
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>

                <SheetHeader className="flex justify-start text-left">
                  <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" prefetch className="flex items-center">
            <AppLogo />
          </Link>

          <div className="ml-auto flex items-center space-x-2">
            {/* Search */}
            <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
              <Search className="size-5! opacity-80 group-hover:opacity-100" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" className="size-10 rounded-full p-1" />}
              >
                <Avatar className="size-8 overflow-hidden rounded-full">
                  <AvatarImage src={auth.user?.avatar} alt={auth.user?.name} />
                  <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {auth.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end">
                {auth.user && <UserMenuContent user={auth.user} />}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {breadcrumbs.length > 1 && (
        <div className="flex w-full border-b border-sidebar-border/70">
          <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
      )}
    </>
  );
}

import { AppSidebar } from '@/components/layout/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { LockKeyhole } from 'lucide-react';
import { Notification, Notifications } from '@/components/notification';

const notifications: Notification[] = [
  {
    id: '1',
    title: 'Payment received',
    description: 'Ahmed Benali paid 1,500 MAD.',
    time: '5m ago',
    read: false,
  },
  {
    id: '2',
    title: 'Budget locked',
    description: 'The 2026 fiscal budget has been locked.',
    time: '1h ago',
    read: false,
  },
  {
    id: '3',
    title: 'Payment reminder',
    description: 'Nadia Cherkaoui has an outstanding balance.',
    time: '3h ago',
    read: true,
  },
];
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center">
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2" />

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator className="hidden md:block" />

                  <BreadcrumbItem>
                    <BreadcrumbPage>Résidence Al Andalus</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
              >
                <LockKeyhole data-icon="inline-start" />
                Budget Locked
              </Badge>
              <Notifications notifications={notifications} />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

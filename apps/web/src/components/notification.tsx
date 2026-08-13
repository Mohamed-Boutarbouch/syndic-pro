import { BellIcon, CheckIcon, CircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export type Notification = {
  id: string;
  title: string;
  description?: string;
  time: string;
  read?: boolean;
};

type NotificationProps = {
  notifications: Notification[];
};

export function Notifications({ notifications }: NotificationProps) {
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          />
        }
      >
        <BellIcon />

        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
        )}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold">Notifications</h3>

            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up"}
            </p>
          </div>

          {unreadCount > 0 && <Badge variant="secondary">{unreadCount}</Badge>}
        </div>

        <Separator />

        <ScrollArea className="h-80">
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="flex h-60 flex-col items-center justify-center text-center">
                <BellIcon className="mb-3 size-8 text-muted-foreground" />

                <p className="text-sm font-medium">No notifications</p>

                <p className="text-xs text-muted-foreground">
                  You're all caught up.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))
            )}
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full">
            Mark all as read
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <button
      type="button"
      className="flex w-full gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent"
    >
      <div className="pt-1">
        {notification.read ? (
          <CheckIcon className="size-4 text-muted-foreground" />
        ) : (
          <CircleIcon className="size-2 fill-primary text-primary" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={notification.read ? 'text-sm' : 'text-sm font-medium'}>
            {notification.title}
          </p>

          <span className="shrink-0 text-[11px] text-muted-foreground">
            {notification.time}
          </span>
        </div>

        {notification.description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {notification.description}
          </p>
        )}
      </div>
    </button>
  );
}

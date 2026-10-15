import { usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

import { OnboardingMenuContext } from '@/components/onboarding/menu-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';

export function OnboardingUserMenu() {
  const { auth } = usePage().props;

  if (!auth.user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-10 gap-2 px-2" data-test="onboarding-user-menu">
            <UserInfo user={auth.user} />
            <ChevronDown className="size-4 opacity-60" />
          </Button>
        }
      />
      <DropdownMenuContent className="min-w-56 rounded-lg" align="end" side="bottom">
        <OnboardingMenuContext user={auth.user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

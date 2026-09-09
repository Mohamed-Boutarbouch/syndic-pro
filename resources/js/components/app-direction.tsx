import { useEffect } from 'react';

import { DirectionProvider } from '@/components/ui/direction';

interface AppDirectionProps {
  direction: 'ltr' | 'rtl';
  children: React.ReactNode;
}

export function AppDirection({ direction, children }: AppDirectionProps) {
  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  return <DirectionProvider direction={direction}>{children}</DirectionProvider>;
}

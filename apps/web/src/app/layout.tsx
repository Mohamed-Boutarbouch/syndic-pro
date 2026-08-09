import './global.css';
import { DM_Sans } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'SyndicPro',
  description: 'Property management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn('font-sans', dmSans.variable)}>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

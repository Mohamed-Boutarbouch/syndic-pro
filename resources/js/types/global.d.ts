import type { Auth } from '@/types/auth';
import type { I18nSharedProps } from '@/types/i18n';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface InputHTMLAttributes<T> {
    passwordrules?: string;
  }
}

declare module '@inertiajs/core' {
  export interface InertiaConfig {
    sharedPageProps: {
      name: string;
      auth: Auth;
      sidebarOpen: boolean;
      i18n: I18nSharedProps;
      [key: string]: unknown;
    };
  }
}

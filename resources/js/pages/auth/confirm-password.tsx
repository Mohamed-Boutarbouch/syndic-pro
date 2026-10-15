import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('auth.confirm.title')} />

      <Form action={store()} resetOnSuccess={['password']} className="space-y-6">
        {({ processing, errors }) => (
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="password">{t('auth.fields.password')}</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder={t('auth.fields.password')}
                autoComplete="current-password"
                autoFocus
              />

              <InputError message={errors.password} />
            </div>

            <div className="flex items-center">
              <Button
                type="submit"
                className="w-full"
                disabled={processing}
                data-test="confirm-password-button"
              >
                {processing && <Spinner />}
                {t('auth.confirm.title')}
              </Button>
            </div>
          </div>
        )}
      </Form>
    </>
  );
}

// title/description are translation keys; the auth layouts call t() on them
ConfirmPassword.layout = {
  title: 'auth.confirm.title',
  description: 'auth.confirm.description',
};

'use client';

import { subscribeEmail } from '@/actions/resend';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Form';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';

export default function EmailSubscribe() {
  const t = useTranslations('EmailSubscribe');

  const onSubmit = async (prevState: string | null, formData: FormData) => {
    const email = formData.get('email');
    if (typeof email !== 'string') return prevState;

    const result = await subscribeEmail(email);
    return result.message;
  };

  const [state, formAction, isPending] = useActionState(onSubmit, null);

  return (
    <form action={formAction} className="flex gap-3">
      <Input
        title={'email'}
        type="email"
        name="email"
        placeholder={state ?? t('emailPlaceholder')}
        required
      />

      <Button type="submit" bg="gray" Icon={Send} className="shrink-0 ">
        {isPending ? t('subscribingButton') : t('subscribeButton')}
      </Button>
    </form>
  );
}

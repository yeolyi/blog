'use client';

import { subscribeEmail } from '@/actions/resend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { confetti } from '@/utils/confetti';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActionState, useRef } from 'react';
import { toast } from 'react-toastify';

export default function EmailSubscribe() {
  const t = useTranslations('EmailSubscribe');
  const ref = useRef<HTMLButtonElement>(null);

  const onSubmit = async (prevState: string | null, formData: FormData) => {
    const email = formData.get('email');
    if (typeof email !== 'string') return prevState;

    const result = await subscribeEmail(email);
    if (!result.success) {
      toast.error(result.value);
      return '';
    }

    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      confetti({
        origin: {
          x: 0.5,
          y: (rect.y + rect.height) / window.innerHeight,
        },
        colors: ['#FFD60A', '#FF375F', '#32D74B', '#0A84FF', '#FF9F0A'],
      });
    }
    return t('successMessage');
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
        className="max-w-xs"
      />

      <Button type="submit" ref={ref}>
        <Send />
        {isPending ? t('subscribingButton') : t('subscribeButton')}
      </Button>
    </form>
  );
}

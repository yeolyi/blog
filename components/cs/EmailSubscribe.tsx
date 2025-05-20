'use client';

import { getSubscriberCount, subscribeEmail } from '@/app/[locale]/actions';
import * as Slider from '@radix-ui/react-slider';
import clsx from 'clsx';
import { delay } from 'es-toolkit';
import JSConfetti from 'js-confetti';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import useSWR, { mutate } from 'swr';

let jsConfetti: InstanceType<typeof JSConfetti> | null = null;

export default function EmailSubscribe() {
  const [email, setEmail] = useState('');
  const t = useTranslations('EmailSubscribe');

  const [isPending, startTransition] = useTransition();

  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [error, setError] = useState('');

  const [confettiNumber, setConfettiNumber] = useState(1000);

  const { data: subscriberCount } = useSWR(
    'subscriber-count',
    getSubscriberCount,
    {
      fallbackData: undefined,
      revalidateOnFocus: true,
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    startTransition(async () => {
      setError('');

      const result = await subscribeEmail(email);

      if (result.success) {
        setSuccess(true);
        setSuccessMessage(result.message);

        // 구독 성공 후 구독자 수 다시 가져오기
        mutate('subscriber-count');

        if (!jsConfetti) jsConfetti = new JSConfetti();

        jsConfetti.addConfetti({
          confettiNumber,
          confettiRadius: 4,
          confettiColors: [
            '#D94773',
            '#D983A6',
            '#DB94BE',
            '#DFB0D3',
            '#E4D0ED',
            '#EEE6FB',
          ],
        });

        await delay(3000);

        setSuccess(false);
        setSuccessMessage('');
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <div className="mb-8">
      <h3 className="text-white font-semibold text-xl mt-[1.6em] mb-1">
        {t('title')}
      </h3>
      <p className="text-gray-400 text-sm mb-3">
        {t('description')}
        <br />
        {t('subscriberCount', { count: subscriberCount ?? 304 })}
      </p>

      <div className="w-full flex gap-2">
        <form onSubmit={handleSubmit} className="relative w-full">
          <input
            type="email"
            value={success ? '' : email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={success ? successMessage : t('emailPlaceholder')}
            required
            className={clsx(
              'bg-transparent text-white border px-3 py-2 flex-grow focus:outline-none focus:border-white w-full',
              success && 'border-green-400 placeholder:text-green-400',
              !success && 'border-white/40',
            )}
            disabled={isPending || success}
          />
        </form>
        <button
          type="submit"
          disabled={isPending}
          className="border-white shrink-0 border bg-white text-black font-medium hover:bg-black hover:text-white disabled:opacity-50 cursor-pointer px-2"
        >
          {isPending ? t('subscribingButton') : t('subscribeButton')}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

      <div className="flex items-center gap-3 mt-4 text-[oklch(87.2%_0.01_258.338)]">
        <span id="confetti-label" className="text-sm whitespace-nowrap">
          {t('confettiLabel')}
        </span>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-[200px] h-5"
          value={[confettiNumber]}
          onValueChange={([value]) => setConfettiNumber(value)}
          max={3000}
          min={100}
          step={100}
          aria-labelledby="confetti-label"
        >
          <Slider.Track className="bg-white/20 relative grow rounded-full h-[3px]">
            <Slider.Range className="absolute bg-white rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-white rounded-full hover:bg-gray-300 focus:bg-gray-300 cursor-pointer"
            aria-label={t('confettiLabel')}
          />
        </Slider.Root>
        <span className="text-sm shrink-0">
          {'🌸 '.repeat(confettiNumber / 1000 + 1)}
        </span>
      </div>
    </div>
  );
}

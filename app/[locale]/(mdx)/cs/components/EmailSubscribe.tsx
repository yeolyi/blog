'use client';

import { subscribeEmail } from '@/app/[locale]/actions';
import { createClient } from '@/utils/supabase/client';
import * as Slider from '@radix-ui/react-slider';
import clsx from 'clsx';
import JSConfetti from 'js-confetti';
import { useState, useTransition } from 'react';
import useSWR, { mutate } from 'swr';

let jsConfetti: InstanceType<typeof JSConfetti> | null = null;

const fetchSubscriberCount = async () => {
  try {
    const supabase = createClient();
    const { data } = await supabase.rpc('get_subscriber_count').throwOnError();
    return data;
  } catch (e) {
    console.error('구독자 수 조회 실패:', e);
    throw e;
  }
};

export default function EmailSubscribe() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [confettiNumber, setConfettiNumber] = useState(1000);

  const { data: subscriberCount } = useSWR(
    'subscriber-count',
    fetchSubscriberCount,
    {
      fallbackData: null,
      revalidateOnFocus: true,
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('유효한 이메일 주소를 입력해주세요');
      return;
    }

    setError('');

    startTransition(async () => {
      try {
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

          setTimeout(() => {
            setSuccess(false);
            setSuccessMessage('');
          }, 3000);
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error('구독 요청 오류:', err);
        setError('구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    });
  };

  return (
    <div className="mb-8">
      <h3 className="text-white font-semibold text-xl mt-[1.6em] mb-1">
        새로운 컨텐츠 알림 받기 💌
      </h3>
      <p className="text-gray-400 text-sm mb-3">
        컴퓨터가 어느정도 만들어질 때마다 이메일을 드릴게요 (무료)
        <br />
        {subscriberCount?.toLocaleString() ?? '-'}명이 구독하고 있어요.
      </p>

      <div>
        <form onSubmit={handleSubmit} className="relative w-full">
          <input
            type="email"
            value={success ? '' : email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              error ? error : success ? successMessage : '이메일 주소'
            }
            required
            className={clsx(
              'bg-transparent text-white border px-3 py-2 flex-grow focus:outline-none focus:border-white w-full',
              error && 'border-red-300 placeholder:text-red-300',
              success &&
                !error &&
                'border-green-400 placeholder:text-green-400',
              !error && !success && 'border-white/40',
            )}
            disabled={isPending || success}
          />
          <button
            type="submit"
            disabled={isPending}
            className="border-white border bg-white text-black font-medium hover:bg-black hover:text-white disabled:opacity-50 cursor-pointer absolute right-0 top-0 bottom-0 px-2"
          >
            {isPending ? '구독중...' : '구독하기'}
          </button>
        </form>
      </div>

      <div className="flex items-center gap-3 mt-4 text-[oklch(87.2%_0.01_258.338)]">
        <span id="confetti-label" className="text-sm whitespace-nowrap">
          폭죽 개수
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
            aria-label="폭죽 개수"
          />
        </Slider.Root>
        <span className="text-sm shrink-0">
          {'🌸 '.repeat(confettiNumber / 1000 + 1)}
        </span>
      </div>
    </div>
  );
}

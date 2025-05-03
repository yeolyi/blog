'use client';

import { subscribeEmail } from '@/app/actions/subscriber';
import JSConfetti from 'js-confetti';
import { useState, useTransition } from 'react';

let jsConfetti: InstanceType<typeof JSConfetti> | null = null;

export default function EmailSubscribe() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

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
          setEmail('');

          if (!jsConfetti) jsConfetti = new JSConfetti();

          jsConfetti.addConfetti({
            confettiNumber: 1000,
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
    <>
      <h3>새로운 컨텐츠 알림 받기 💌</h3>
      <p>이메일로 새 글과 업데이트 소식을 받아보세요.</p>

      <div
        className="relative mt-3"
        style={{ minHeight: 56 }} // 메시지 박스 높이 고정 (56px 정도, 필요시 조절)
      >
        {success ? (
          <div className="absolute inset-0 flex items-center bg-green-900/30 border border-green-700 text-white p-3 transition-all duration-200 outline outline-2 outline-green-700">
            {successMessage}
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center bg-red-900/30 border border-red-700 text-white p-3 transition-all duration-200 outline outline-2 outline-red-700">
            {error}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="absolute inset-0 flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              required
              className={`bg-transparent text-white border ${
                error ? 'border-red-500' : 'border-white/40'
              } px-3 py-2 flex-grow focus:outline-none focus:border-white`}
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-white text-black font-medium hover:bg-black hover:text-white hover:border hover:border-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isPending ? '구독중...' : '구독하기'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

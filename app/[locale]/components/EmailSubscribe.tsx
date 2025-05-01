'use client';

import { subscribeEmail } from '@/app/actions/subscriber';
import { useState, useTransition } from 'react';

export default function EmailSubscribe() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
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
        // 서버 액션 호출
        const result = await subscribeEmail(email);

        if (result.success) {
          setSuccess(true);
          setEmail('');
          // 3초 후 성공 메시지 숨기기
          setTimeout(() => {
            setSuccess(false);
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
    <div className="prose prose-invert w-full">
      <h3 className="text-lg font-semibold">새로운 컨텐츠 알림 받기</h3>
      <p className="text-sm mt-1">
        이메일로 새 글과 업데이트 소식을 받아보세요.
      </p>

      {success ? (
        <div className="bg-green-900/30 border border-green-700 text-white p-3 rounded mt-3">
          구독해주셔서 감사합니다!
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-3 flex flex-col sm:flex-row gap-2"
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
            className="px-4 py-2 bg-white text-black font-medium hover:bg-black hover:text-white hover:border hover:border-white transition-colors disabled:opacity-50"
          >
            {isPending ? '구독중...' : '구독하기'}
          </button>
        </form>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-white p-3 rounded mt-3">
          {error}
        </div>
      )}
    </div>
  );
}

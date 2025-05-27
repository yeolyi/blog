import crypto from 'node:crypto';
import type { Session } from '@supabase/supabase-js';
import { verify } from 'jsonwebtoken';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

const headerToIp = (headersList: ReadonlyHeaders) => {
  // 일반적인 프록시 헤더들을 확인
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for는 쉼표로 구분된 IP 목록일 수 있음, 첫 번째를 사용
    return forwardedFor.split(',')[0].trim();
  }

  // 다른 일반적인 헤더들도 확인
  const realIp = headersList.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // 기본값 사용
  return '127.0.0.1';
};

export const getUserId = async ({
  session,
  headers,
}: {
  session: Session | null | undefined;
  headers: ReadonlyHeaders;
}) => {
  if (session) {
    verify(
      session.access_token,
      // @ts-expect-error TOOD: 환경변수 타입 명시
      process.env.JWT_SECRET,
    );
    console.log('session.user.id', session.user.id);
    return session.user.id;
  }

  if (process.env.IP_SALT === undefined)
    throw new Error('IP_SALT is not defined');

  const ip = headerToIp(headers);
  console.log('ip', ip);

  return crypto
    .createHash('sha256')
    .update(`${ip}-${process.env.IP_SALT}`)
    .digest('hex');
};

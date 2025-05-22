'use server';
import { getErrMessage } from '@/utils/string';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

// Resend 객체 생성
const resend = new Resend(process.env.RESEND_API_KEY);

// 오디언스 ID 설정 (Resend 대시보드에서 생성한 ID)
// biome-ignore lint/style/noNonNullAssertion: 없으면 터지는게 맞음
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID!;

type SubscribeResult = {
  success: boolean;
  message: string;
};

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  const resp = await resend.contacts.create({ email, audienceId: AUDIENCE_ID });

  // TODO: 이 페이지 말고 다른 곳에서도 구독자 수를 사용한다면...?
  revalidatePath('/cs');
  revalidatePath('/en/cs');

  if (resp.error) {
    return {
      success: false,
      message: `${resp.error.message}`,
    };
  }
  return {
    success: true,
    message: '구독이 완료되었습니다. 감사합니다!',
  };
}

// 구독자 수 조회 함수
export async function getSubscriberCount() {
  try {
    const response = await resend.contacts.list({ audienceId: AUDIENCE_ID });
    return {
      success: true,
      value: response.data?.data.length,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrMessage(error),
    };
  }
}

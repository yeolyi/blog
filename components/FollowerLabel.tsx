export const dynamic = 'force-dynamic';

import { getErrorMessage } from '@/util/error';
import { fetchFollowerCnt } from '@/util/fetch';
import { Suspense } from 'react';

export default async function FollowerLabel() {
  return (
    <Suspense>
      <Label />
    </Suspense>
  );
}

const Label = async () => {
  try {
    const cnt = await fetchFollowerCnt();
    return `${cnt} 팔로워`;
  } catch (e) {
    return `에러: ${getErrorMessage(e)}`;
  }
};

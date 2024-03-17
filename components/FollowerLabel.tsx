import { getErrorMessage } from '@/util/error';
import { fetchFollowerCnt } from '@/util/fetch';

export default async function FollowerLabel() {
  try {
    const cnt = await fetchFollowerCnt();
    return `${cnt} 팔로워`;
  } catch (e) {
    return `에러: ${getErrorMessage(e)}`;
  }
}

'use server';
import { wrapServerAction } from '@/utils/error';

// 메모리 캐시를 위한 변수들
let cachedData: { followers_count: number; id: string } | null = null;
let cacheTimestamp: number | null = null;

const CACHE_DURATION = 60 * 1000;
const INSTAGRAM_ID = '17841413948950087';

export const getInstagramFollowers = wrapServerAction(async () => {
	// 캐시된 데이터가 유효한지 확인
	const now = Date.now();
	if (
		cachedData !== null &&
		cacheTimestamp !== null &&
		now - cacheTimestamp < CACHE_DURATION
	) {
		return cachedData;
	}

	try {
		const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
		const tokenExpiresAt = process.env.FACEBOOK_ACCESS_TOKEN_EXPIRES_AT;

		if (!accessToken) {
			throw new Error('FACEBOOK_ACCESS_TOKEN이 설정되지 않았습니다.');
		}

		if (!tokenExpiresAt) {
			throw new Error('FACEBOOK_ACCESS_TOKEN_EXPIRES_AT이 설정되지 않았습니다.');
		}

		// 토큰 만료 확인
		const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 변환
		const expiresAt = parseInt(tokenExpiresAt, 10);

		if (currentTime >= expiresAt) {
			throw new Error(
				`Facebook 액세스 토큰이 만료되었습니다. 만료일: ${new Date(expiresAt * 1000).toLocaleString()}`,
			);
		}

		const url = `https://graph.facebook.com/v23.0/${INSTAGRAM_ID}?fields=followers_count&access_token=${accessToken}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		// API 응답에서 팔로워 수와 ID 추출
		if (typeof data.followers_count === 'number' && data.id) {
			const result = {
				followers_count: data.followers_count,
				id: data.id,
			};

			// 캐시 업데이트
			cachedData = result;
			cacheTimestamp = now;

			return result;
		}

		throw new Error('팔로워 수를 파싱할 수 없습니다.');
	} catch (error) {
		console.error(error);

		// 에러 발생 시 캐시된 데이터가 있다면 반환
		if (cachedData !== null) {
			return cachedData;
		}

		throw error;
	}
});

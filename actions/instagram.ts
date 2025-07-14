'use server';
import { wrapServerAction } from '@/utils/error';

// 메모리 캐시를 위한 변수들
let cachedFollowersCount: number | null = null;
let cacheTimestamp: number | null = null;

// 캐시 유효 시간 (24시간)
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간을 밀리초로 변환

export const getInstagramFollowers = wrapServerAction(
	async (username: string) => {
		// 캐시된 데이터가 유효한지 확인
		const now = Date.now();
		if (
			cachedFollowersCount !== null &&
			cacheTimestamp !== null &&
			now - cacheTimestamp < CACHE_DURATION
		) {
			return cachedFollowersCount;
		}

		try {
			const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
			const response = await fetch(url, {
				headers: {
					'User-Agent':
						'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)',
					Origin: 'https://www.instagram.com',
					Referer: 'https://www.instagram.com/',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			// API 응답에서 팔로워 수 추출
			const followersCount = data?.data?.user?.edge_followed_by?.count;

			if (typeof followersCount === 'number') {
				// 캐시 업데이트
				cachedFollowersCount = followersCount;
				cacheTimestamp = now;

				return followersCount;
			}

			throw new Error('팔로워 수를 파싱할 수 없습니다.');
		} catch (error) {
			// 에러 발생 시 캐시된 데이터가 있다면 반환
			if (cachedFollowersCount !== null) {
				return cachedFollowersCount;
			}
			throw error;
		}
	},
);

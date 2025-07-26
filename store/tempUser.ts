import { v4 as uuidv4 } from 'uuid';

const TEMP_USER_ID_KEY = 'temp_user_id';

// 임시 사용자 ID를 가져오거나 생성하는 함수
function getTempUserId(): string {
	// 브라우저 환경이 아닌 경우 임시 ID 반환
	if (typeof window === 'undefined') {
		return 'temp-server-user';
	}

	// localStorage에서 기존 ID 확인
	const existingId = localStorage.getItem(TEMP_USER_ID_KEY);

	if (existingId) {
		return existingId;
	}

	// 기존 ID가 없으면 새로 생성
	const newId = uuidv4();
	localStorage.setItem(TEMP_USER_ID_KEY, newId);

	return newId;
}

// 임시 사용자 ID export
export const tempUserId = getTempUserId();

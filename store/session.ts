import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import supabase from '@/db';
import { loginToDB, logoutFromDB } from '@/db/auth';
import { getErrMessage } from '@/utils/string';

type SessionState = {
	session: Session | null;
	isLoading: boolean;

	// 액션
	setSession: (session: Session | null) => void;
	setLoading: (isLoading: boolean) => void;

	// 인증 메서드
	login: () => Promise<{
		success: boolean;
		error: string;
	}>;
	logout: () => Promise<{
		success: boolean;
		error: string;
	}>;
};

export const useSessionStore = create<SessionState>((set) => ({
	session: null,
	isLoading: true,

	setSession: (session) => set({ session }),
	setLoading: (isLoading) => set({ isLoading }),

	login: async () => {
		try {
			set({ isLoading: true });
			await loginToDB();
			return { success: true, error: '' };
		} catch (error) {
			return {
				success: false,
				error: getErrMessage(error),
			};
		}
	},

	logout: async () => {
		try {
			await logoutFromDB();
			set({ session: null });
			return { success: true, error: '' };
		} catch (error) {
			console.error('로그아웃 오류:', error);
			return {
				success: false,
				error: getErrMessage(error),
			};
		}
	},
}));

// 인증 상태 변경 감지를 위한 리스너 설정
export function initializeAuthListener() {
	const { setSession, setLoading } = useSessionStore.getState();

	// 인증 상태 변경 감지
	// 이걸 써야 탭 간에 상태 동기화가 가능하다.
	const {
		data: { subscription },
	} = supabase.auth.onAuthStateChange((_event, session) => {
		setSession(session);
		setLoading(false);
	});

	// 구독 정리 함수 반환
	return () => {
		subscription.unsubscribe();
	};
}

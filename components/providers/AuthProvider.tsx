'use client';

import { useEffect } from 'react';
import { initializeAuthListener } from '@/store/session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		return initializeAuthListener();
	}, []);

	return <>{children}</>;
}

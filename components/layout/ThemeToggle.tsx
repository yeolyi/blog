'use client';

import { Loader2, Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const cycleTheme = () => {
		if (theme === 'light') {
			setTheme('dark');
		} else if (theme === 'dark') {
			setTheme('system');
		} else {
			setTheme('light');
		}
	};

	const getIcon = () => {
		if (!isMounted) return <Loader2 className='animate-spin' />;

		if (theme === 'light') {
			return <Sun />;
		}
		if (theme === 'dark') {
			return <Moon />;
		}
		return <SunMoon />;
	};

	return (
		<Button
			variant='secondary'
			size='icon'
			onClick={cycleTheme}
			disabled={!isMounted}
		>
			{getIcon()}
			<span className='sr-only'>Toggle theme</span>
		</Button>
	);
}

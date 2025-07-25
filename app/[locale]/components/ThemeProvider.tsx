'use client';

import { useEffect } from 'react';

// https://github.com/pacocoursey/next-themes/issues/78#issuecomment-2927060208
function useMetaTheme() {
	useEffect(() => {
		const updateThemeColor = () => {
			const bgColor = window.getComputedStyle(document.body).backgroundColor;
			const metaThemeColor = document.querySelector('meta[name=theme-color]');
			metaThemeColor?.setAttribute('content', bgColor);
		};

		const observer = new MutationObserver(updateThemeColor);

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['style', 'class'],
			subtree: false,
		});

		updateThemeColor();

		return () => observer.disconnect();
	}, []);
}

export default function MetaHandler() {
	useMetaTheme();
	return null;
}

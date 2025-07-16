'use client';

import { getSandpackCssText } from '@codesandbox/sandpack-react';
import { useServerInsertedHTML } from 'next/navigation';

/**
 * Ensures CSSinJS styles are loaded server side.
 */
export const SandPackCSS = () => {
	useServerInsertedHTML(() => {
		return (
			<style
				// biome-ignore lint/security/noDangerouslySetInnerHtml: sandpack에서 하래
				dangerouslySetInnerHTML={{ __html: getSandpackCssText() }}
				id='sandpack'
			/>
		);
	});
	return null;
};

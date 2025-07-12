'use client';

import {
	defaultDark,
	defaultLight,
	SandpackCodeEditor,
	SandpackConsole,
	SandpackPreview,
	type SandpackProps,
	SandpackProvider,
} from '@codesandbox/sandpack-react';
import { useTheme } from 'next-themes';

export default function _Code(
	props: SandpackProps & { showTabs?: boolean; activeFile?: string },
) {
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === 'dark';
	const sandpackTheme = isDark ? defaultDark : defaultLight;

	return (
		<SandpackProvider
			theme={{
				...sandpackTheme,
				font: {
					...sandpackTheme.font,
					body: 'var(--font-monoplex-kr)',
					mono: 'var(--font-monoplex-kr)',
					size: '14px',
				},
			}}
			template='react'
			{...props}
			files={{
				// Strict Mode 제거
				'/index.js': {
					hidden: true,
					code: `import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
const root = createRoot(document.getElementById("root"));
root.render(<App />);
`,
				},
				...props.files,
			}}
			options={{
				...props.options,
				bundlerURL: 'https://sandpack.yeolyi.com',
				recompileDelay: 1000,
			}}
		>
			<SandpackCodeEditor
				className='h-fit border'
				showTabs={props.showTabs ?? false}
				showLineNumbers={false}
				showInlineErrors={false}
			/>
			<SandpackPreview showOpenInCodeSandbox={false} className='bg-white border' />
			<SandpackConsole
				resetOnPreviewRestart
				className='h-fit font-(var(--font-monoplex-kr)) text-base border'
				showResetConsoleButton={false}
			/>
		</SandpackProvider>
	);
}

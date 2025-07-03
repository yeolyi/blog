'use client';

import {
	defaultDark,
	defaultLight,
	SandpackConsole,
	SandpackPreview,
	type SandpackProps,
	SandpackProvider,
} from '@codesandbox/sandpack-react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

// TODO
// 안하니까 hydration error 뜸 흠......
const SandpackCodeEditor = dynamic(
	() =>
		import('@codesandbox/sandpack-react').then((mod) => mod.SandpackCodeEditor),
	{
		ssr: false,
	},
);

export default function Code(
	props: SandpackProps & { showTabs?: boolean; activeFile?: string },
) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const sandpackTheme = isDark ? defaultDark : defaultLight;

	return (
		<SandpackProvider
			className='not-prose'
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
			<PreviewWithLog />
		</SandpackProvider>
	);
}

const PreviewWithLog = () => {
	return (
		<>
			<SandpackPreview showOpenInCodeSandbox={false} className='bg-white border' />
			<SandpackConsole
				resetOnPreviewRestart
				className='h-fit font-(var(--font-monoplex-kr)) text-base border'
				showResetConsoleButton={false}
			/>
		</>
	);
};

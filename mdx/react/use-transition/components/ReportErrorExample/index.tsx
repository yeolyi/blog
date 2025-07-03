'use client';

import { AlertTriangle, MessageSquareWarning, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ReportErrorExample() {
	const [logs, setLogs] = useState<string[]>([]);

	const addLog = useCallback((log: string) => {
		setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
	}, []);

	useEffect(() => {
		const originalOnError = window.onerror;
		const originalUnhandledRejection = window.onunhandledrejection;

		addLog('Error handlers attached');

		window.onerror = (message, _source, lineno, _colno, error) => {
			addLog(`[onerror] message: ${error?.message || message}, lineno: ${lineno}`);
			// true를 반환하면 브라우저 콘솔에 에러가 출력되지 않습니다.
			return true;
		};

		const errorListener = (event: ErrorEvent) => {
			addLog(
				`[error listener] message: ${event.message}, filename: ${event.filename.split('/').pop()}`,
			);
			// event.preventDefault(); // 브라우저의 기본 에러 처리를 막습니다.
		};

		window.addEventListener('error', errorListener);

		return () => {
			addLog('Error handlers removed');
			window.onerror = originalOnError;
			window.removeEventListener('error', errorListener);
			window.onunhandledrejection = originalUnhandledRejection;
		};
	}, [addLog]);

	const handleThrowError = () => {
		addLog('--- "Throw Error" clicked ---');
		// React의 에러 경계를 벗어나 전역 에러 핸들러에서 에러를 잡기 위해 setTimeout을 사용합니다.
		setTimeout(() => {
			throw new Error('This is a thrown error!');
		}, 0);
	};

	const handleReportError = () => {
		addLog('--- "Report Error" clicked ---');
		const newError = new Error('This is a reported error!');
		// reportError는 스크립트를 중단시키지 않습니다.
		window.reportError(newError);
		addLog('reportError was called. Script execution continues.');
	};

	return (
		<div className='not-prose rounded-xl border bg-card text-card-foreground shadow'>
			<div className='flex flex-col space-y-1.5 p-6'>
				<h3 className='font-semibold leading-none tracking-tight'>
					`throw Error` vs `window.reportError()`
				</h3>
				<p className='text-sm text-muted-foreground'>
					두 버튼을 클릭하여 전역 에러 핸들러의 동작 차이를 확인하세요.
				</p>
			</div>
			<div className='p-6 pt-0'>
				<div className='flex gap-2'>
					<Button onClick={handleThrowError} variant='destructive'>
						<AlertTriangle />
						Throw Error
					</Button>
					<Button onClick={handleReportError} variant='secondary'>
						<MessageSquareWarning />
						Report Error
					</Button>
					<Button onClick={() => setLogs([])} variant='secondary'>
						<Trash2 />
						Clear Logs
					</Button>
				</div>
				<div className='mt-4 h-64 overflow-auto rounded-md bg-slate-900 p-4 font-mono text-sm text-white'>
					{logs.map((log, i) => (
						<div key={i} className='border-b border-b-slate-700 py-1'>
							{log}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

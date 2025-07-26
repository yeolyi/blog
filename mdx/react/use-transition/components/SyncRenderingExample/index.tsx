'use client';

import { Rabbit, Turtle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';

const totalItems = 20000;
const createItems = () => {
	const items = [];
	for (let i = 0; i < totalItems; i++) {
		items.push(`Item ${i + 1} of ${totalItems}`);
	}
	return items;
};

// 컴포넌트 외부에 선언하여 한 번만 생성되도록 합니다.
const allItems = createItems();

function FilterableList({
	items,
	isPending,
}: {
	items: string[];
	isPending: boolean;
}) {
	return (
		<ul
			className={`mt-4 h-64 overflow-y-auto rounded-md bg-slate-100 p-2 transition-opacity dark:bg-slate-800 ${
				isPending ? 'opacity-50' : 'opacity-100'
			}`}
		>
			{items.map((item) => (
				<li key={item} className='p-1'>
					{item}
				</li>
			))}
		</ul>
	);
}

export default function SyncRenderingExample() {
	const [isPending, startTransition] = useTransition();
	const [useTransitionEnabled, setUseTransitionEnabled] = useState(true);
	const [filter, setFilter] = useState('');

	const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextFilter = e.target.value;
		if (useTransitionEnabled) {
			startTransition(() => {
				setFilter(nextFilter);
			});
		} else {
			setFilter(nextFilter);
		}
	};

	const filteredItems = allItems.filter((item) => item.includes(filter));

	return (
		<div className='rounded-xl border bg-card text-card-foreground shadow'>
			<div className='flex flex-col space-y-1.5 p-6'>
				<h3 className='font-semibold leading-none tracking-tight'>
					동기적인 무거운 렌더링 작업
				</h3>
				<p className='text-sm text-muted-foreground'>
					`useTransition`을 사용하여 무거운 동기 렌더링 중에도 UI 반응성을 유지하는
					예제입니다. 토글 버튼으로 `useTransition`을 끄고 켜면서 입력창의 반응
					속도를 비교해 보세요.
				</p>
			</div>
			<div className='p-6 pt-0'>
				<div className='flex items-center gap-4'>
					<input
						type='text'
						placeholder={`Search in ${totalItems} items...`}
						onChange={handleFilterChange}
						className='w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
					/>
					<Button
						onClick={() => setUseTransitionEnabled((p) => !p)}
						variant={useTransitionEnabled ? 'default' : 'secondary'}
						className='flex-shrink-0'
					>
						{useTransitionEnabled ? <Rabbit /> : <Turtle />}
						{useTransitionEnabled ? 'On' : 'Off'}
					</Button>
				</div>

				<div
					className={`mt-2 text-sm font-semibold text-blue-500 ${
						isPending ? 'opacity-100' : 'opacity-0'
					} transition-opacity`}
				>
					{isPending ? '업데이트 중...' : ' '}
				</div>

				<FilterableList items={filteredItems} isPending={isPending} />
			</div>
		</div>
	);
}

'use client';

import { Suspense, useState } from 'react';

import AboutTab from './AboutTab';
import PostsTab from './PostsTab';
import TabButton from './TabButton';

export default function UseTransitionExample() {
	const [tab, setTab] = useState('about');

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex gap-2'>
				<TabButton isActive={tab === 'about'} onClick={() => setTab('about')}>
					About
				</TabButton>
				<TabButton isActive={tab === 'posts'} onClick={() => setTab('posts')}>
					Posts
				</TabButton>
			</div>

			<div className='p-4 border border-zinc-200 dark:border-zinc-800 rounded-md'>
				<Suspense fallback={<p>Loading...</p>}>
					{tab === 'about' ? <AboutTab /> : <PostsTab />}
				</Suspense>
			</div>
		</div>
	);
}

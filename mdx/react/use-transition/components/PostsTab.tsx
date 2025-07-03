'use client';

import { use } from 'react';

// cache는 안된다
// 'use client'로 선언된 클라이언트 컴포넌트에서 react의 cache 함수를 사용한 것이 원인입니다.
// cache 함수는 서버 컴포넌트에서 데이터 요청을 캐시하기 위해 설계되었으며,
// 클라이언트 컴포넌트에서는 매 렌더링마다 캐시가 무효화됩니다.
// 이로 인해 PostsTab 컴포넌트가 렌더링될 때마다 fetchPosts 함수가 계속해서 새로운 프로미스(Promise)를 생성하고,
// use 훅이 컴포넌트를 다시 일시 중단시키면서 무한 루프가 발생한 것입니다.

// NOTE: This is a hack to make the demo work.
// In a real app, you would use a library like react-query or swr.
let promise: Promise<string[]> | null = null;
const fetchPosts = (): Promise<string[]> => {
	if (promise === null)
		promise = new Promise((resolve) => {
			console.log('Fetching posts...');
			setTimeout(() => {
				console.log('Fetched posts.');
				const posts = Array.from({ length: 3 }, (_, i) => `Post #${i + 1}`);
				resolve(posts);
			}, 1000);
		});
	return promise;
};

export default function PostsTab() {
	const posts = use(fetchPosts());
	return (
		<ul>
			{posts.map((post: string) => (
				<li key={post}>{post}</li>
			))}
		</ul>
	);
}

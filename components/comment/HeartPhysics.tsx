'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getThumbUpUserIds } from '@/db/comment/read';
import { addEmojiReactionInDB } from '@/db/comment/update';
import { cn } from '@/lib/utils';
import { tempUserId } from '@/store/tempUser';
import { HEIGHT, useHeartPhysics } from './hooks/useHeartPhysics';

export default function GaltonBoard({
	sessionId,
	postId,
}: {
	sessionId?: string;
	postId: string;
}) {
	const { containerRef, dropBall } = useHeartPhysics();
	const [data, setData] = useState<string[]>([]);

	const userId = sessionId ?? tempUserId;
	const isReacted = data?.includes(userId) ?? false;

	useEffect(() => {
		let done = false;

		const fetchData = async () => {
			if (done) return;
			const data = await getThumbUpUserIds(postId);
			setData(data);
			data.forEach((userId) => {
				dropBall(userId);
			});
		};
		fetchData();

		return () => {
			done = true;
		};
	}, [postId, dropBall]);

	return (
		<div className='relative'>
			<Button
				onClick={async () => {
					dropBall(userId);

					if (isReacted) return;

					await addEmojiReactionInDB({ postId, userId });
					setData((prev) => [...prev, userId]);
				}}
				className='absolute top-2 left-2 flex items-center z-10'
				variant='outline'
			>
				<Heart className={cn(isReacted && 'fill-red-500 stroke-0')} />
				{data?.length}
			</Button>
			<div
				ref={containerRef}
				data-galton-container
				style={{ height: `${HEIGHT}px` }}
				// 이거 box-content 써야되는거 어디 기록하면 좋을듯
				// box-border면 좋겠지만 계산이 귀찮음
				className='box-content border border-border bg-background w-full relative overflow-hidden'
			>
				{/* useGaltonBoard에서 모든 구슬들을 추가함 */}
			</div>
		</div>
	);
}

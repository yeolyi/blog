'use client';
import { Shuffle } from 'lucide-react';
import { AddMemeDrawer } from '@/app/[locale]/memes/components/AddMemeDrawer';
import MemeCard from '@/app/[locale]/memes/components/MemeCard';
import TagOption from '@/app/[locale]/memes/components/TagOption';
import { useMemeViewer } from '@/app/[locale]/memes/hooks/useMemeViewer';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/swr/auth';
import { NO_TAG_ID } from '@/swr/meme';

export default function MemeViewer() {
	const { data: profile } = useProfile();
	const { tags, selectedTag, memes, onSelectTag, onShuffle } = useMemeViewer();

	if (profile?.role !== 'admin')
		return <p className='text-center'>관리자 권한이 필요해요.</p>;

	return (
		<div className='px-6 w-full flex flex-col gap-7'>
			<div className='flex flex-wrap gap-2 max-w-3xl'>
				{tags.map((tag) => (
					<TagOption
						key={tag.id}
						id={`tag-${tag.id}`}
						name='tag'
						value={tag.name}
						checked={selectedTag === tag.id}
						onCheckedChange={(checked) => {
							if (checked === true) onSelectTag(tag.id);
						}}
					/>
				))}
			</div>

			<div className='columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4'>
				{memes.map((meme) => (
					<MemeCard key={meme.id} data={meme} />
				))}
			</div>

			<div className='fixed bottom-8 right-8 flex flex-col gap-2'>
				<AddMemeDrawer />
				{selectedTag === NO_TAG_ID && (
					<Button type='button' onClick={onShuffle}>
						<Shuffle />
						셔플
					</Button>
				)}
			</div>
		</div>
	);
}

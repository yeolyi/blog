import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { DeleteMemeDialog } from '@/app/[locale]/memes/components/DeleteMemeDialog';
import { TagOption } from '@/app/[locale]/memes/components/TagOption';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { updateMeme, useMemeTags, useTags } from '@/swr/meme';
import type { Meme } from '@/types/helper.types';

export type MemeCardProps = Meme;

const MemeCard = ({ data: meme }: { data: MemeCardProps }) => {
	const [open, setOpen] = useState(false);
	const { data: tags } = useTags();
	const { data: memeTags } = useMemeTags(meme.id);

	// 선택된 태그 이름 집합
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [newTag, setNewTag] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	// 추가 태그 입력용 상태 (저장 시 한번에 적용)

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) {
			// Drawer 열릴 때 초기값 설정
			if (tags && memeTags) {
				const initial = new Set<string>();
				for (const mt of memeTags) {
					const tag = tags.find((t) => t.id === mt.tag_id);
					if (tag) initial.add(tag.name);
				}
				setSelected(initial);
			}
		}
		setOpen(nextOpen);
	};

	const toggleTag = (tagName: string, checked: boolean) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (checked) next.add(tagName);
			else next.delete(tagName);
			return next;
		});
	};

	const handleSave = async () => {
		if (isSaving) return;
		setIsSaving(true);
		// 입력창의 태그들을 파싱하여 선택된 태그 집합에 추가
		const typedTags = newTag
			.split(',')
			.map((t) => t.trim())
			.filter((t) => t.length > 0);

		const tagSet = new Set(selected);
		for (const t of typedTags) tagSet.add(t);

		await updateMeme(
			{
				id: meme.id,
				tags: Array.from(tagSet),
				hidden: false,
			},
			memeTags?.map((mt) => mt.tag_id ?? '') ?? [],
		);

		setNewTag('');
		setOpen(false);
		setIsSaving(false);
	};

	return (
		<Drawer open={open} onOpenChange={handleOpenChange}>
			<DrawerTrigger asChild>
				<button type='button' className='flex flex-col w-full bg-secondary mb-7'>
					{/** biome-ignore lint/performance/noImgElement: vercel에 낼 돈 없어서 이거 씀 */}
					<img
						src={meme.media_url}
						alt={meme.title ?? ''}
						width={meme.width}
						height={meme.height}
					/>
					<p className='text-left leading-snug text-secondary-foreground p-4'>
						{meme.title}
					</p>
				</button>
			</DrawerTrigger>

			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle className='text-white'>밈 편집</DrawerTitle>
				</DrawerHeader>

				<div className='max-w-sm mx-auto'>
					<div className='p-4 pb-0 flex flex-col gap-7 '>
						{/* 태그 선택 */}
						<div className='flex flex-wrap gap-2'>
							{(tags ?? []).map((tag) => {
								const checked = selected.has(tag.name);
								return (
									<TagOption
										key={tag.id ?? tag.name}
										id={`tagArr-${tag.id ?? tag.name}`}
										name='tagArr'
										value={tag.name}
										checked={checked}
										onCheckedChange={(c: boolean) => toggleTag(tag.name, c === true)}
									/>
								);
							})}
						</div>

						{/* 새 태그 입력 (콤마로 구분) */}
						<Input
							value={newTag}
							onChange={(e) => setNewTag(e.target.value)}
							placeholder='새 태그(콤마 구분)'
						/>
					</div>

					<DrawerFooter>
						<div className='flex gap-2 justify-end'>
							<DeleteMemeDialog
								memeId={meme.id}
								memeTags={memeTags}
								onDelete={() => setOpen(false)}
							/>
							<Button
								type='button'
								variant='default'
								onClick={handleSave}
								disabled={isSaving}
							>
								{isSaving ? <Loader2 className='animate-spin' /> : <Save />}
								저장
							</Button>
						</div>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default MemeCard;

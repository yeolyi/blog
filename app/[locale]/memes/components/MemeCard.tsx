import clsx from 'clsx';
import { Loader2, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { mutate } from 'swr/_internal';
import TagOption from '@/app/[locale]/memes/components/TagOption';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { deleteMemeFromDB } from '@/db/meme/delete';
import { memesByTagKey } from '@/swr/key';
import { NO_TAG_ID, updateMeme, useMemeTags, useTags } from '@/swr/meme';
import type { Meme } from '@/types/helper.types';

export type MemeCardProps = Meme;

const MemeCard = ({ data: meme }: { data: MemeCardProps }) => {
	const [open, setOpen] = useState(false);
	const { data: tags } = useTags();
	const { data: memeTags } = useMemeTags(meme.id);

	// 선택된 태그 이름 집합
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [hidden, setHidden] = useState<boolean>(meme.hidden);
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
				setHidden(meme.hidden);
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

	// ... 삭제: handleAddTag 및 extraTags 관련 로직

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

		await updateMeme({
			id: meme.id,
			tags: Array.from(tagSet),
			hidden,
		});

		setNewTag('');
		setOpen(false);
		setIsSaving(false);
	};

	const [deleteOpen, setDeleteOpen] = useState(false);

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
										onCheckedChange={(c) => toggleTag(tag.name, c === true)}
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

						{/* hidden 여부 */}
						<div className='flex items-center gap-2'>
							<Checkbox
								id={`hidden-${meme.id}`}
								name='hidden'
								checked={hidden}
								onCheckedChange={(c) => setHidden(c === true)}
							/>
							<Label htmlFor={`hidden-${meme.id}`} className='text-white'>
								숨김
							</Label>
						</div>
					</div>

					<DrawerFooter>
						<div className='flex gap-2 justify-end'>
							<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
								<DialogTrigger asChild>
									<Button type='button' variant='destructive'>
										<Trash2 />
										삭제
									</Button>
								</DialogTrigger>
								<DialogContent showCloseButton className='sm:max-w-sm'>
									<DialogHeader>
										<DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
										<DialogDescription>삭제된 밈은 복구할 수 없습니다.</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<div className='flex gap-2 justify-end'>
											<Button
												type='button'
												variant='outline'
												onClick={() => setDeleteOpen(false)}
											>
												취소
											</Button>
											<Button
												type='button'
												variant='destructive'
												onClick={async () => {
													await deleteMemeFromDB(meme.id);
													mutate(memesByTagKey(NO_TAG_ID));
													for (const tag of memeTags ?? []) {
														if (tag.tag_id) mutate(memesByTagKey(tag.tag_id));
													}
													setDeleteOpen(false);
													setOpen(false);
												}}
											>
												삭제
											</Button>
										</div>
									</DialogFooter>
								</DialogContent>
							</Dialog>
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

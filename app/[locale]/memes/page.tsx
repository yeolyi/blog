'use client';
import { Plus, Shuffle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { fileToAVIFAction } from '@/actions/image';
import MemeCard from '@/app/[locale]/memes/components/MemeCard';
import TagOption from '@/app/[locale]/memes/components/TagOption';
import { useMemeViewer } from '@/app/[locale]/memes/hooks/useMemeViewer';
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
import { Label } from '@/components/ui/label';
import { uploadMemeToDB } from '@/db/meme/create';
import { useProfile } from '@/swr/auth';
import { memesByTagKey } from '@/swr/key';
import { NO_TAG_ID } from '@/swr/meme';
import { getErrMessage } from '@/utils/string';

export default function MemeViewer() {
	const { data: profile } = useProfile();
	const { tags, selectedTag, memes, onSelectTag, onShuffle } = useMemeViewer();

	if (profile?.role !== 'admin')
		return <p className='text-white text-center'>관리자 권한이 필요해요.</p>;

	return (
		<div className='px-4 w-full flex flex-col gap-7'>
			<div className='flex flex-wrap gap-2 max-w-2xl'>
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

const AddMemeDrawer = () => {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		const form = e.currentTarget;
		const formData = new FormData(form);
		const title = formData.get('title') as string;
		const image = formData.get('image') as File;

		const avif = await fileToAVIFAction(image);

		if (typeof avif === 'string') {
			toast.error(`이미지 변환 실패: ${avif}`);
			setIsLoading(false);
			return;
		}

		try {
			await uploadMemeToDB(
				title,
				// TODO: 타입 해결
				new Blob([avif as BlobPart], { type: 'image/avif' }),
			);
			await mutate(memesByTagKey(NO_TAG_ID));
			form.reset();
			setOpen(false);
		} catch (e) {
			toast.error(getErrMessage(e));
		}
		setIsLoading(false);
	};

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button type='button'>
					<Plus />
					추가
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className='max-w-sm mx-auto w-full'>
					<DrawerHeader>
						<DrawerTitle>밈 추가</DrawerTitle>
					</DrawerHeader>

					<form
						id='add-meme-form'
						className='flex flex-col gap-7 p-4 pb-0'
						onSubmit={handleSubmit}
					>
						<div className='flex flex-col gap-2'>
							<Label htmlFor='title'>제목</Label>
							<Input id='title' name='title' type='text' required />
						</div>
						<div className='flex flex-col gap-2'>
							<Label htmlFor='image'>이미지</Label>
							<Input id='image' name='image' type='file' accept='image/*' required />
						</div>
					</form>

					<DrawerFooter>
						<Button
							type='submit'
							form='add-meme-form'
							variant='default'
							className='w-fit ml-auto'
							disabled={isLoading}
						>
							<Plus />
							추가
						</Button>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

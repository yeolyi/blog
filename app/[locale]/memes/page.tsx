'use client';
import { Clipboard, ImageIcon, Plus, Shuffle } from 'lucide-react';
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
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const handleImageChange = (file: File | null) => {
		setImageFile(file);
		if (file) {
			const url = URL.createObjectURL(file);
			setImagePreview(url);
		} else {
			setImagePreview(null);
		}
	};

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleImageChange(file);
		}
	};

	const handlePasteFromClipboard = async () => {
		try {
			const clipboardItems = await navigator.clipboard.read();
			for (const item of clipboardItems) {
				const imgType = item.types.find((type) => type.startsWith('image/'));
				if (imgType) {
					const blob = await item.getType(imgType);
					const file = new File([blob], 'clipboard-image.png', { type: blob.type });
					handleImageChange(file);
					return;
				}
			}
			toast.error('클립보드에 이미지가 없습니다.');
		} catch {
			toast.error('클립보드 접근 실패');
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		const form = e.currentTarget;
		const formData = new FormData(form);
		const title = formData.get('title') as string;
		const image = imageFile || (formData.get('image') as File);

		if (!image) {
			toast.error('이미지를 선택해주세요.');
			setIsLoading(false);
			return;
		}

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
			setImageFile(null);
			setImagePreview(null);
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
							<div className='flex gap-2'>
								<Input
									id='image'
									name='image'
									type='file'
									accept='image/*'
									onChange={handleFileInput}
									className='flex-1'
								/>
								<Button
									type='button'
									variant='outline'
									onClick={handlePasteFromClipboard}
								>
									<Clipboard />
								</Button>
							</div>
							{/* 이미지 미리보기 영역 (고정 높이) */}
							<div className='mt-2 h-48 border border-border flex items-center justify-center overflow-hidden'>
								{imagePreview ? (
									// biome-ignore lint/performance/noImgElement: 돈없다
									<img
										src={imagePreview}
										alt='미리보기'
										className='max-w-full max-h-full object-contain'
									/>
								) : (
									<ImageIcon className='w-8 h-8 text-muted' />
								)}
							</div>
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

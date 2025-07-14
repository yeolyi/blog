'use client';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { mutate } from 'swr/_internal';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteMemeFromDB } from '@/db/meme/delete';
import { memesByTagKey } from '@/swr/key';
import { NO_TAG_ID } from '@/swr/meme';

type DeleteMemeDialogProps = {
	memeId: string;
	memeTags?: Array<{ tag_id: string | null }>;
	onDelete?: () => void;
};

export const DeleteMemeDialog = ({
	memeId,
	memeTags,
	onDelete,
}: DeleteMemeDialogProps) => {
	const [open, setOpen] = useState(false);

	const handleDelete = async () => {
		await deleteMemeFromDB(memeId);
		mutate(memesByTagKey(NO_TAG_ID));

		// 관련 태그들의 캐시도 업데이트
		for (const tag of memeTags ?? []) {
			if (tag.tag_id) mutate(memesByTagKey(tag.tag_id));
		}

		setOpen(false);
		onDelete?.();
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button type='button' variant='destructive'>
					<Trash2 />
					삭제
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
					<AlertDialogDescription>
						삭제된 밈은 복구할 수 없습니다.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<div className='flex gap-2 justify-end'>
						<Button type='button' variant='outline' onClick={() => setOpen(false)}>
							취소
						</Button>
						<Button type='button' variant='destructive' onClick={handleDelete}>
							삭제
						</Button>
					</div>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

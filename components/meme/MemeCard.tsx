import clsx from 'clsx';
import { Save, Trash2 } from 'lucide-react';
import { useReducer } from 'react';
import { mutate } from 'swr/_internal';
import TagCheckbox from '@/components/meme/TagCheckbox';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { deleteMemeFromDB } from '@/db/meme/delete';
import { memesByTagKey } from '@/swr/key';
import { NO_TAG_ID, updateMeme, useMemeTags, useTags } from '@/swr/meme';
import type { Meme } from '@/types/helper.types';

export type MemeCardProps = Meme;

const MemeCard = ({ data: meme }: { data: MemeCardProps }) => {
	const [isEdit, toggleIsEdit] = useReducer((prev) => !prev, false);
	const { data: tags } = useTags();
	const { data: memeTags } = useMemeTags(meme.id);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const tagStr = formData.get('tagStr') as string;
		const tagArr = formData.getAll('tagArr') as string[];
		const hidden = formData.get('hidden') === 'on';

		const set = new Set(
			[...tagArr, ...tagStr.split(',')].filter((tag) => tag !== ''),
		);
		const tags = Array.from(set);
		await updateMeme({ id: meme.id, tags, hidden });

		toggleIsEdit();
	};

	return (
		<>
			<button
				type='button'
				onClick={toggleIsEdit}
				className='flex flex-col bg-stone-700 cursor-pointer hover:opacity-90 transition-opacity text-left w-full p-0'
			>
				{/** biome-ignore lint/performance/noImgElement: vercel에 낼 돈 없어서 이거 씀 */}
				<img
					src={meme.media_url}
					alt={meme.title ?? ''}
					width={meme.width}
					height={meme.height}
				/>
				<p className='text-white p-1'>{meme.title}</p>
			</button>

			{isEdit && (
				<form className={clsx('flex flex-col gap-3 py-4')} onSubmit={onSubmit}>
					<TagCheckbox
						tags={tags ?? []}
						name='tagArr'
						initialValues={memeTags?.map((tag) => tag.tag_id ?? '') ?? []}
					/>

					<Checkbox name='hidden' defaultChecked={meme.hidden} />

					<div className='flex gap-2 self-end'>
						<Button
							type='button'
							variant='destructive'
							onClick={async () => {
								if (confirm('정말 삭제하시겠습니까?')) {
									await deleteMemeFromDB(meme.id);
									mutate(memesByTagKey(NO_TAG_ID));
									for (const tag of memeTags ?? []) {
										// TODO: if 필요한가?
										if (tag.tag_id) mutate(memesByTagKey(tag.tag_id));
									}
								}
							}}
						>
							<Trash2 />
							삭제
						</Button>
						<Button type='submit' variant='default'>
							<Save />
							저장
						</Button>
					</div>
				</form>
			)}
		</>
	);
};

export default MemeCard;

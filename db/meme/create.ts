import { toast } from 'sonner';
import { v4 } from 'uuid';
import supabase from '@/db';
import { uploadFileToDB } from '@/db/storage';

export async function uploadMemeToDB(title: string, file: Blob) {
	const fileExt = file.type.split('/')[1];
	const fileName = `${v4()}.${fileExt}`;
	const url = await uploadFileToDB(fileName, file);

	toast.success('1/2 이미지 업로드 완료');

	// 이미지 크기 얻기
	const { width, height } = await new Promise<{
		width: number;
		height: number;
	}>((resolve) => {
		const img = new Image();
		img.onload = () => {
			const { naturalWidth, naturalHeight } = img;
			resolve({ width: naturalWidth, height: naturalHeight });
		};
		img.src = url;
	});

	await supabase
		.from('memes')
		.insert([{ title, media_url: url, width, height }])
		.select()
		.single()
		.throwOnError();

	toast.success('2/2 밈 추가 완료');
}

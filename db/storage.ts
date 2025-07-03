import supabase from '@/db';

export async function uploadFileToDB(
	filePath: string,
	file: File | Blob,
): Promise<string> {
	// TODO: 여기서 data로 바로 반환 못하나?
	const { error: uploadError } = await supabase.storage
		.from('memes')
		.upload(filePath, file);

	if (uploadError) throw uploadError;

	const { data: publicUrlData } = supabase.storage
		.from('memes')
		.getPublicUrl(filePath);

	return publicUrlData.publicUrl;
}

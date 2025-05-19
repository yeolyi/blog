import supabase from '@/db/createClient';

export async function uploadFile(
  filePath: string,
  file: File | Blob,
): Promise<string> {
  const { error: uploadError } = await supabase.storage
    .from('memes')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from('memes')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

import { isDev } from '@/constants/phase';
import {
  type ImageFeatureExtractionPipeline,
  pipeline,
} from '@xenova/transformers';

let extractor: ImageFeatureExtractionPipeline | null = null;

export async function getImageEmbedding(imageUrl: string): Promise<number[]> {
  if (!isDev) throw new Error('Not allowed in production');
  extractor ??= await pipeline(
    'image-feature-extraction',
    'Xenova/clip-vit-large-patch14',
  );

  const output = await extractor(imageUrl);
  const outputArr = Array.from(output.data);

  const norm = Math.sqrt(outputArr.reduce((sum, x) => sum + x * x, 0));
  const normalized = outputArr.map((x) => x / norm);

  return normalized;
}

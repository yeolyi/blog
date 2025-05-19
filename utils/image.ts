import {
  type ImageFeatureExtractionPipeline,
  pipeline,
} from '@xenova/transformers';

let extractor: ImageFeatureExtractionPipeline | null = null;

export async function getClipEmbeddingFromUrl(
  imageUrl: string,
): Promise<number[]> {
  if (!extractor) {
    extractor = await pipeline(
      'image-feature-extraction',
      'Xenova/clip-vit-large-patch14',
      { cache_dir: '/tmp/.cache' },
    );
  }

  const output = await extractor(imageUrl);
  const outputArr = Array.from(output.data);
  const norm = Math.sqrt(outputArr.reduce((sum, x) => sum + x * x, 0));
  return outputArr.map((x) => x / norm);
}

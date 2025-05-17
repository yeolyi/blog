'use client';

import Button from '@/app/[locale]/components/ui/Button';
import Form from '@/app/[locale]/components/ui/Form';
import { Link, useRouter } from '@/i18n/navigation';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { crawlInstagramImage } from '../actions';

export default function ImportMeme() {
  const router = useRouter();

  const formMethods = useForm<{ url: string }>({
    defaultValues: { url: '' },
  });

  const [similarMemes, setSimilarMemes] = useState<string[]>([]);

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    setError,
  } = formMethods;

  const onSubmit = async (data: { url: string }) => {
    if (!data.url) return;

    const crawlResult = await crawlInstagramImage(data.url);

    switch (crawlResult.type) {
      case 'similar_meme_found':
        setSimilarMemes(crawlResult.similarMemes);
        break;
      case 'no_image_found':
      case 'upload_failed':
        setError('root', { message: crawlResult.error });
        break;
      case 'success':
        router.push(`/memes/random/${crawlResult.meme.id}`);
        break;
      default:
        setError('root', { message: '알 수 없는 오류가 발생했습니다' });
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Text
          title="URL"
          registerName="url"
          registerOptions={{ required: true, minLength: 1 }}
        />

        <Button
          theme="gray"
          type="submit"
          disabled={isSubmitting || !isValid}
          Icon={Download}
          className="w-fit"
        >
          이미지 가져오기
        </Button>
      </Form>

      {similarMemes.length > 0 && (
        <ul className="flex flex-wrap gap-2 text-red-600">
          {similarMemes.map((meme) => (
            <li key={meme}>
              <Link className="underline" href={`/memes/random/${meme}`}>
                {meme}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </FormProvider>
  );
}

'use client';

import Button from '@/app/[locale]/components/ui/Button';
import Form from '@/app/[locale]/components/ui/Form';
import { memeImagesAtom } from '@/app/[locale]/memes/store';
import { Link, useRouter } from '@/i18n/navigation';
import { useSetAtom } from 'jotai';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { crawlInstagramImage } from '../actions';

export default function ImportMeme() {
  const router = useRouter();
  const setMemeImages = useSetAtom(memeImagesAtom);

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
    if (crawlResult.success) {
      setMemeImages(crawlResult.value);
      router.push('/memes/select');
    } else {
      setError('root', { message: crawlResult.error });
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

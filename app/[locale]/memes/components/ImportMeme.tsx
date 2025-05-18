'use client';

import Button from '@/app/[locale]/components/ui/Button';
import Form, { Label, LabelGroup } from '@/app/[locale]/components/ui/Form';
import Link from '@/app/[locale]/components/ui/Link';
import { memeImagesAtom } from '@/app/[locale]/memes/store';
import { useRouter } from '@/i18n/navigation';
import { useSetAtom } from 'jotai';
import { FileCheck, FileJson, Instagram } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { crawlInstagramImage } from '../actions';

export default function ImportMeme() {
  const router = useRouter();
  const setMemeImages = useSetAtom(memeImagesAtom);

  const formMethods = useForm<{ url: string }>({
    defaultValues: { url: '' },
  });

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
        <div className="flex flex-col gap-2">
          <Form.Text
            title="URL"
            registerName="url"
            registerOptions={{ required: true, minLength: 1 }}
            placeholder="https://www.instagram.com/p/..."
          />

          <Button
            theme="gray"
            type="submit"
            disabled={isSubmitting || !isValid}
            Icon={Instagram}
            className="w-fit"
          >
            가져오기
          </Button>
        </div>

        <LabelGroup>
          <Label>추가 기능</Label>
          <div className="flex gap-2">
            <Link theme="gray" locale="ko" href="/memes/bulk" Icon={FileJson}>
              JSON
            </Link>
            <Link
              theme="gray"
              locale="ko"
              href="/memes/buttons"
              Icon={FileCheck}
            >
              중복검사
            </Link>
          </div>
        </LabelGroup>
      </Form>
    </FormProvider>
  );
}

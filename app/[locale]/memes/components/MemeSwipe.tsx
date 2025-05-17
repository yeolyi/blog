'use client';

import Button from '@/app/[locale]/components/ui/Button';
import Form from '@/app/[locale]/components/ui/Form';
import { getRandomMeme, updateMeme } from '@/app/[locale]/memes/actions';
import type { Meme, Tag } from '@/types/meme';
import { ChevronRight, Save } from 'lucide-react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface FormValues {
  title: string;
  tagInput: string;
  hidden: boolean;
}

export default function MemeSwipe({
  initialMeme,
  allTags,
}: {
  initialMeme: Meme;
  allTags: Tag[];
}) {
  const [meme, setMeme] = useState<Meme>(initialMeme);
  const [loading, setLoading] = useState(false);

  const formMethods = useForm<FormValues>({
    defaultValues: {
      title: meme.title,
      tagInput: meme.meme_tags.map((tag) => tag.tags.name).join(', '),
      hidden: meme.hidden,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
    reset,
  } = formMethods;

  const loadNext = useCallback(async () => {
    try {
      setLoading(true);

      const nextMeme = await getRandomMeme();

      setMeme(nextMeme);
      reset({
        title: nextMeme.title,
        tagInput: nextMeme.meme_tags.map((tag) => tag.tags.name).join(', '),
        hidden: nextMeme.hidden,
      });
    } catch (err) {
      setError('root', {
        message:
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다',
      });
    } finally {
      setLoading(false);
    }
  }, [reset, setError]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {
      const tagsList = data.tagInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await updateMeme({
        id: meme.id,
        title: data.title,
        tags: tagsList,
        hidden: data.hidden,
      });

      await loadNext();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError('root', { message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <img
        src={meme.media_url}
        alt={meme.title}
        width={meme.width}
        height={meme.height}
        className="h-[50vh] object-contain mx-auto mt-20"
      />

      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 max-w-2xl mx-auto px-4"
      >
        <Form.Text title="제목" registerName="title" />
        <Form.TagList registerName="tagInput" allTags={allTags} />
        <Form.Checkbox label="숨김" registerName="hidden" />

        <div className="flex justify-end gap-4">
          <Button
            theme="gray"
            onClick={loadNext}
            disabled={loading}
            Icon={ChevronRight}
          >
            다음
          </Button>
          <Button
            theme="green"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || loading}
            Icon={Save}
          >
            저장
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
}

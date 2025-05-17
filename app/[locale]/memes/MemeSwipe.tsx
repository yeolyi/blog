'use client';

import Button from '@/app/[locale]/components/ui/Button';
import Form from '@/app/[locale]/components/ui/Form';
import Link from '@/app/[locale]/components/ui/Link';
import {
  deleteMeme,
  getRandomMeme,
  updateMeme,
} from '@/app/[locale]/memes/actions';
import type { Meme, Tag } from '@/types/meme';
import { ChevronRight, List, Trash } from 'lucide-react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface FormValues {
  title: string;
  tagInput: string;
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
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
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

  const onDelete = async () => {
    await deleteMeme(meme.id);
    await loadNext();
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    console.log(isDirty);
    if (!isDirty) {
      await loadNext();
      return;
    }

    try {
      const tagsList = data.tagInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await updateMeme({
        id: meme.id,
        title: data.title,
        tags: tagsList,
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
        className="w-full aspect-[4/5] max-w-xl mx-auto object-contain mt-20 border border-stone-700"
      />

      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 max-w-2xl mx-auto px-4"
      >
        <Form.Text title="제목" registerName="title" />
        <Form.TagList registerName="tagInput" allTags={allTags} />

        <div className="flex justify-between gap-4">
          <Link theme="gray" href="/memes/" Icon={List} locale="ko">
            목록
          </Link>
          <div className="flex gap-4">
            <Button
              theme="red"
              type="button"
              onClick={() => confirm('삭제하시겠습니까?') && onDelete()}
              disabled={loading}
              Icon={Trash}
            >
              삭제
            </Button>
            <Button
              theme="gray"
              type="button"
              onClick={loadNext}
              disabled={loading}
              Icon={ChevronRight}
            >
              다음
            </Button>
          </div>
        </div>
      </Form>
    </FormProvider>
  );
}

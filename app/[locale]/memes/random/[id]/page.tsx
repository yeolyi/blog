'use client';

import Button from '@/components/ui/Button';
import Form from '@/components/ui/Form';
import Link from '@/components/ui/Link';
import { deleteMeme } from '@/db/meme/delete';
import { getMemeWithTag, getRandomMeme } from '@/db/meme/read';
import { updateMeme } from '@/db/meme/update';
import { getTags } from '@/db/memeTag/read';
import { useRouter } from '@/i18n/navigation';
import type { Meme } from '@/types/helper.types';
import { ChevronRight, List, Trash } from 'lucide-react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import useSWR from 'swr';

export default function MemeSwipe({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { data: allTags } = useSWR('/api/tags', getTags);

  const formMethods = useForm<Meme & { tagInput: string }>({
    defaultValues: async () => {
      const { id } = await params;
      const meme = await getMemeWithTag(id);
      return {
        ...meme,
        title: meme.title ?? '',
        tagInput: meme.meme_tags.map((tag) => tag.tags?.name ?? '').join(','),
      };
    },
  });

  const {
    handleSubmit,
    formState: { isDirty },
    setError,
    control,
  } = formMethods;

  const meme = useWatch({ control: control });

  const next = async () => {
    const id = await getRandomMeme();
    router.push(`/memes/random/${id}`, { scroll: false });
  };

  const onDelete = async () => {
    const { id } = await params;
    await deleteMeme(id);
    await next();
  };

  const onSubmit = async (data: Meme & { tagInput: string }) => {
    if (!isDirty) {
      await next();
      return;
    }

    try {
      const { id } = await params;

      const tagsList = data.tagInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await updateMeme({ id: id, title: data.title ?? '', tags: tagsList });

      await next();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError('root', { message });
    }
  };

  return (
    <FormProvider {...formMethods}>
      <img
        src={meme.media_url}
        alt={meme.title ?? ''}
        width={meme.width}
        height={meme.height}
        className="w-full aspect-[4/5] max-w-xl object-contain mt-20 border border-stone-700 mx-auto mb-4"
      />

      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 max-w-2xl mx-auto px-4 w-full"
      >
        <Form.Text title="제목" registerName="title" />
        <Form.TagList registerName="tagInput" allTags={allTags ?? []} />

        <div className="flex justify-between gap-4">
          <Link theme="gray" href="/memes/" Icon={List} locale="ko">
            목록
          </Link>
          <div className="flex gap-4">
            <Button
              theme="red"
              type="button"
              onClick={() => confirm('삭제하시겠습니까?') && onDelete()}
              Icon={Trash}
            >
              삭제
            </Button>
            <Button theme="gray" type="submit" Icon={ChevronRight}>
              다음
            </Button>
          </div>
        </div>
      </Form>
    </FormProvider>
  );
}

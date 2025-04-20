'use client';

import { connectMemeToTag } from '@/actions/meme';
import { uploadFileToSupabase } from '@/actions/supabase';
import { getMediaTypeFromFile } from '@/utils/form';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

interface FormInputs {
  title: string;
  description: string;
  file: FileList;
  tags: string;
}

const uploadForm = async (data: FormInputs) => {
  const file = data.file[0];
  const supabase = createClient();

  // 파일 업로드
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${fileName}`;
  const url = await uploadFileToSupabase(filePath, file);

  // memes 테이블에 정보 저장
  const { data: meme } = await supabase
    .from('memes')
    .insert([
      {
        title: data.title,
        description: data.description,
        media_url: url,
      },
    ])
    .select()
    .single()
    .throwOnError();

  // 태그가 없다면 아래는 스킵
  if (!data.tags.trim()) return;

  const tagNames = data.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag);

  for (const tagName of tagNames) {
    await connectMemeToTag(meme.id, tagName);
  }
};

export default function UploadMeme() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<FormInputs>({
    defaultValues: {
      title: '',
      description: '',
      tags: '',
    },
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const file = data.file[0];

    // 파일 타입 자동 감지
    const mediaType = getMediaTypeFromFile(file);

    // 타입에 맞는 파일인지 확인
    if (mediaType === 'image' && !file.type.startsWith('image/')) {
      setFormError('file', { message: '이미지 파일만 업로드 가능합니다' });
      return;
    }

    if (mediaType === 'video' && !file.type.startsWith('video/')) {
      setFormError('file', { message: '비디오 파일만 업로드 가능합니다' });
      return;
    }

    try {
      await uploadForm(data);
      router.push('/memes');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';

      // 폼 전체 에러 설정
      setFormError('root', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root?.message && (
        <div
          style={{
            color: 'red',
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid red',
          }}
        >
          <strong>오류:</strong> {errors.root.message}
        </div>
      )}

      <div>
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          {...register('title', { required: '제목을 입력해주세요' })}
        />
        {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description">설명 (선택사항)</label>
        <textarea id="description" {...register('description')} rows={3} />
      </div>

      <div>
        <label htmlFor="file">파일</label>
        <input
          id="file"
          type="file"
          {...register('file', { required: '파일을 선택해주세요' })}
          accept="image/*,video/*" // 모든 이미지와 비디오 파일 허용
        />
        {errors.file && <p style={{ color: 'red' }}>{errors.file.message}</p>}
      </div>

      <div>
        <label htmlFor="tags">태그 (쉼표로 구분)</label>
        <input
          id="tags"
          type="text"
          {...register('tags')}
          placeholder="예: 재밌는, 귀여운, 대학생"
        />
      </div>

      <div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '업로드 중...' : '업로드'}
        </button>
      </div>
    </form>
  );
}

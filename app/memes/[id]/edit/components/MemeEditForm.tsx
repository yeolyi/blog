'use client';

import type { Meme } from '@/types/meme';
import { getMediaTypeFromUrl } from '@/utils/form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateMeme } from '@/app/memes/actions';
import Link from 'next/link';

interface MemeEditFormProps {
  meme: Meme;
}

export default function MemeEditForm({ meme }: MemeEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(meme.title);
  const [description, setDescription] = useState(meme.description || '');
  const [tags, setTags] = useState(
    meme.meme_tags.map((tag) => tag.tags.name).join(', '),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('제목은 필수입니다');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 태그 처리
      const tagsList = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await updateMeme({
        id: meme.id,
        title: title.trim(),
        description: description.trim() || undefined,
        tags: tagsList,
      });

      router.push(`/memes/${meme.id}`);
      router.refresh();
    } catch (err) {
      console.error('수정 중 오류:', err);
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link href={`/memes/${meme.id}`} style={{ textDecoration: 'none' }}>
          ← 돌아가기
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
        >
          {getMediaTypeFromUrl(meme.media_url) === 'image' ? (
            <Image
              src={meme.media_url}
              alt={meme.title}
              width={600}
              height={400}
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          ) : (
            // biome-ignore lint/a11y/useMediaCaption: 보여줄 캡션이 없다...
            <video
              src={meme.media_url}
              controls
              style={{ maxWidth: '100%', height: 'auto' }}
            >
              Your browser does not support video playback.
            </video>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          {error && (
            <div
              style={{
                background: '#ffebee',
                color: '#c62828',
                padding: '0.5rem 1rem',
                marginBottom: '1rem',
                borderRadius: '4px',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="title"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
              }}
            >
              제목 *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="description"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
              }}
            >
              설명
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                minHeight: '100px',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="tags"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
              }}
            >
              태그 (쉼표로 구분)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="태그1, 태그2, 태그3"
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link
              href={`/memes/${meme.id}`}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                background: '#f0f0f0',
                textDecoration: 'none',
                color: '#333',
              }}
            >
              취소
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

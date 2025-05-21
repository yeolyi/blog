'use client';

import Button from '@/components/ui/Button';
import { uploadMemesToDB } from '@/db/meme/create';
import {
  getMemeFromDB,
  getMemeIdsFromDB,
  getNoEmbeddingMemesFromDB,
  matchSimilarMemeAtDB,
} from '@/db/meme/read';
import { updateMemeAtDB } from '@/db/meme/update';
import { Link } from '@/i18n/navigation';
import type { FormActionReturn } from '@/types/form';
import { getErrMessage } from '@/utils/string';
import { getImageEmbedding } from '@/utils/transformer';
import { Eye, Plus, RefreshCcw } from 'lucide-react';
import { useActionState, useReducer } from 'react';

export default function MemeManage() {
  const [log, addLog] = useReducer(
    (prev: string[], action: string) => [...prev, action],
    [],
  );
  const [similarIds, addSimilarId] = useReducer(
    (prev: [string, string, number][], action: [string, string, number]) => [
      ...prev,
      action,
    ],
    [],
  );

  const uploadMemesAction = async (
    _: FormActionReturn | null,
    formData: FormData,
  ) => {
    try {
      const json = formData.get('json');
      if (typeof json !== 'string') {
        throw new Error('유효하지 않은 JSON 형식');
      }
      const memes = JSON.parse(json);
      await uploadMemesToDB(memes);
      return { success: true, message: '업로드 완료' };
    } catch (e) {
      return { success: false, message: getErrMessage(e) };
    }
  };

  const updateEmbeddings = async () => {
    try {
      const memes = await getNoEmbeddingMemesFromDB();
      for (const [index, id] of memes.entries()) {
        const meme = await getMemeFromDB(id);
        try {
          addLog(`${index + 1}/${memes.length} 갱신 중...`);
          await updateMemeAtDB({
            id: meme.id,
            // @ts-expect-error supabase 타입 문제
            embedding: await getImageEmbedding(meme.media_url),
          });
        } catch (e) {
          addLog(`실패: ${getErrMessage(e)}`);
        }
      }
      addLog('모든 임베딩 갱신 완료');
    } catch (e) {
      addLog(`임베딩 갱신 실패: ${getErrMessage(e)}`);
    }
  };

  const checkSimilar = async () => {
    const ids = await getMemeIdsFromDB();
    let found = 0;
    for (const id of ids) {
      const similar = await matchSimilarMemeAtDB({
        query_id: id,
        match_threshold: 0.1,
        match_count: 5,
      });
      for (const { id: id2, distance } of similar) {
        addSimilarId([id, id2, distance]);
        found++;
      }
      if (found > 10) break;
    }
  };

  const [state, action, isPending] = useActionState(uploadMemesAction, null);

  return (
    <form
      action={action}
      className="flex flex-col gap-4 max-w-2xl mx-auto my-auto w-full"
    >
      <label htmlFor="json" className="block font-bold text-white">
        JSON 데이터
      </label>
      <textarea
        name="json"
        rows={10}
        className="w-full p-2 rounded bg-[#333] text-white border border-[#555]"
        placeholder='[{"title": "밈 제목", "imageURL": "https://example.com/image.jpg"}]'
        required
      />

      <Button
        bg="green"
        Icon={Plus}
        disabled={isPending}
        type="submit"
        className="w-fit"
      >
        {isPending ? '업로드 중...' : '일괄 업로드'}
      </Button>

      <Button
        bg="gray"
        Icon={RefreshCcw}
        type="button"
        onClick={updateEmbeddings}
        className="w-fit"
      >
        임베딩 갱신
      </Button>

      <Button
        bg="gray"
        Icon={Eye}
        type="button"
        onClick={checkSimilar}
        className="w-fit"
      >
        유사도 비교
      </Button>

      {state?.message && <p className="text-red-500">{state.message}</p>}
      <ol>
        {log.map((message, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 음...
          <li key={index} className="text-green-500">
            {message}
          </li>
        ))}
      </ol>
      <ol>
        {similarIds.map(([id, id2, distance], index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 음...
          <li key={index} className="text-green-500">
            <Link target="_blank" href={`/memes/${id}`}>
              {id.slice(0, 6)}
            </Link>{' '}
            와{' '}
            <Link target="_blank" href={`/memes/${id2}`}>
              {id2.slice(0, 6)}
            </Link>
            의 유사도: {distance}
          </li>
        ))}
      </ol>
    </form>
  );
}

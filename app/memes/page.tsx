import { Suspense } from "react";
import { getMemes, getAllTags } from "./actions";
import MemeList from "@/app/memes/components/MemeList";
import { getIsAdmin } from "@/utils/auth";
import Link from "next/link";

export default async function MemesPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  // 쿼리 파라미터에서 태그 가져오기
  const tag = searchParams.tag;

  // admin인 경우 밈 데이터 조회 및 표시
  const [memesResult, isAdmin, tags] = await Promise.all([
    getMemes(tag),
    getIsAdmin(),
    getAllTags(),
  ]);

  return (
    <div style={{ padding: "2rem" }}>
      {isAdmin && (
        <>
          <Link href="/memes/upload">밈 추가</Link>
          <br />
          <Link href="/memes/batch-upload">배치 업로드</Link>
        </>
      )}
      <Suspense fallback={<div>로딩 중...</div>}>
        <MemeList
          memes={memesResult.data || []}
          isAdmin={isAdmin}
          allTags={tags}
          selectedTag={tag}
        />
      </Suspense>
    </div>
  );
}

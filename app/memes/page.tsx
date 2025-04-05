import { Suspense } from "react";
import { getIsAdmin } from "@/utils/auth";
import Link from "next/link";
import MemeListServer from "@/app/memes/components/MemeListServer";

export default async function MemesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;

  // admin인 경우 밈 데이터 조회 및 표시
  const isAdmin = await getIsAdmin();

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
        <MemeListServer isAdmin={isAdmin} selectedTag={tag} />
      </Suspense>
    </div>
  );
}

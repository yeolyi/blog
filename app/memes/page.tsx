import { Suspense } from "react";
import { getMemes } from "./actions";
import MemeList from "@/app/memes/components/MemeList";
import { getIsAdmin } from "@/utils/auth";
import Link from "next/link";

export default async function MemesPage() {
  // admin인 경우 밈 데이터 조회 및 표시
  const memes = await getMemes();
  const isAdmin = await getIsAdmin();

  return (
    <div style={{ padding: "2rem" }}>
      <Suspense fallback={<div>로딩 중...</div>}>
        <MemeList memes={memes} />
      </Suspense>
      {isAdmin && (
        <>
          <Link href="/memes/upload">밈 추가</Link>
          <br />
          <Link href="/memes/batch-upload">배치 업로드</Link>
        </>
      )}
    </div>
  );
}

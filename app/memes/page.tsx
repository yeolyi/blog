import { Suspense } from "react";
import { getIsAdmin } from "@/utils/auth";
import MemeListServer from "@/app/memes/components/MemeListServer";
import {  styled } from "@pigment-css/react";
import Link from "next/link";

export default async function MemesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;

  // admin인 경우 밈 데이터 조회 및 표시
  const isAdmin = await getIsAdmin();

  return (
    <Container>
      {isAdmin && (
        <AdminContainer>
          <AdminLink href="/memes/upload">밈 추가</AdminLink>
          <AdminLink href="/memes/batch-upload">배치 업로드</AdminLink>
        </AdminContainer>
      )}
      <Suspense fallback={<LoadingText>로딩 중...</LoadingText>}>
        <MemeListServer  selectedTag={tag} />
      </Suspense>
    </Container>
  );
}

const Container = styled.div`
  margin: 6rem auto 30vh auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AdminContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;


const LoadingText = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: #5e5e5e;
`;

const AdminLink = styled(Link)`
  text-decoration: underline;
  color: white;
  cursor: pointer;
`
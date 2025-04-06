import { Suspense } from "react";
import MemeListServer from "@/app/memes/components/MemeListServer";
import {  styled } from "@pigment-css/react";
import Admin from "@/app/memes/components/Admin";
export default async function MemesPage() {

  return (
    <Container>
      <Suspense>
        <Admin/>
      </Suspense>
      <Suspense fallback={<LoadingText>로딩 중...</LoadingText>}>
        <MemeListServer />
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

const LoadingText = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: #5e5e5e;
`;


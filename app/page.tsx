import Link from "next/link";
import me from "./assets/me.jpg";
import Image from "next/image";
import { styled } from "@pigment-css/react";
import Post from "@/app/components/Post";
import Tile from "@/app/components/Tile";
import MemeTile from "@/app/components/MemeTile";
export default async function Home() {
  return (
    <Container>
      <ImageContainer>
        <Image src={me} alt="me" fill objectFit="cover" />
        <SNSLinkContainer>
          <SNSLink href="https://github.com/yeolyi/blog">GitHub</SNSLink>
          <SNSLink href="https://www.instagram.com/yeol.dev">Instagram</SNSLink>
        </SNSLinkContainer>
      </ImageContainer>
      <Introduction>
        안녕하세요👋 개발자 이성열입니다.{" "}
        <IntroductionLink href="https://cse.snu.ac.kr">
          서울대 컴공 홈페이지
        </IntroductionLink>{" "}
        리뉴얼 프로젝트에 프론트엔드 개발자로 참여했습니다. 지금은 카카오에서{" "}
        <IntroductionLink href="https://edoc.kakao.com/desktop">
          전자문서
        </IntroductionLink>
        를 개발합니다.{" "}
        <IntroductionLink href="https://www.instagram.com/yeol.dev">
          인스타그램
        </IntroductionLink>
        에는 개발자를 위한 컨텐츠를 공유해요.
      </Introduction>

      <Post>
        <Post.Item href="/post/sample" date="2024-01-01" title="샘플 글" />
        <Post.Item href="/post/sample" date="2024-01-01" title="샘플 글" />
        <Post.Item href="/post/sample" date="2024-01-01" title="샘플 글" />
      </Post>

      <Tile>
        <MemeTile/>
      </Tile>
    </Container>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: 6rem auto 30vh auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
`;

const SNSLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: absolute;
  bottom: 20px;
  left: 20px;
`;

const SNSLink = styled(Link)`
  display: block;
  color: white;
  font-size: 2rem;
  font-weight: 600;
  background-color: black;
  width: fit-content;

  &:hover {
    background-color: white;
    color: black;
  }
`;

const Introduction = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  word-break: keep-all;
`;

const IntroductionLink = styled(Link)`
  color: white;
  &:hover {
    color: black;
    background-color: white;
  }
`;


import Image from 'next/image';
import { ReactNode } from 'react';

import Giscus from '@/components/common/Giscus';
import { PostContainer, PostTile } from '@/components/common/PostTile';
import {
  Copy,
  Headline,
  SectionHeadline,
  TopSection,
} from '@/components/common/Typography';
import { Tile } from '@/components/gallery/Tile';
import { WideTile, WideTileProps } from '@/components/gallery/WideTile';
import Footer from '@/components/layout/Footer';
import { CserealBg } from '@/components/main/CserealBg';
import CSSBookTile from '@/components/main/CSSBookTile';
import InstaBg from '@/components/main/InstaBg';
import JSBookTile from '@/components/main/JsBookTile';
import { cssTileProps } from '@/content/cssTileProps';
import { jsTileProps } from '@/content/jsTileProps';
import { postTileProps } from '@/content/postTileProps';
import { webTileProps } from '@/content/webTileProps';
import profile from '@/public/profile.jpg';

import { Gallery } from '../components/gallery/Gallery';

export default function Page() {
  return (
    <>
      <main>
        <Image
          src={profile}
          alt="어렸을 때 사진"
          className="block h-[calc(100vh-350px)] max-h-[calc(((100vw*9)/16))] min-h-[calc(((100vw*9)/16)*0.57)] w-full object-cover"
          priority
        />

        <TopSection>
          <Headline>이성열 yeolyi</Headline>
          <Copy>
            배우고 익히는 재미로 사는 프론트엔드 개발자입니다. 제가 배운 것과
            경험한 것들을 다듬어 여기에 공유해요.
          </Copy>
        </TopSection>

        <Section>
          <SectionHeadline className="horizontal-pad">
            <strong>프로젝트</strong>
          </SectionHeadline>

          <Gallery wide>
            {projectList.map((prop) => (
              <WideTile key={prop.href} {...prop} />
            ))}
          </Gallery>
        </Section>

        <Section>
          <div className="horizontal-pad">
            <SectionHeadline>
              <strong>자바스크립트 공부 기록.</strong> 예제 코드를 수정하고
              실행해보세요.
            </SectionHeadline>
          </div>

          <Gallery>
            <JSBookTile />
            {jsTileProps.map((prop, idx) => (
              <Tile key={idx} {...prop} />
            ))}
          </Gallery>
        </Section>

        <Section>
          <div className="horizontal-pad">
            <SectionHeadline>
              <strong>Web API 공부 기록.</strong> 자바스크립트로 브라우저
              조작하기.
            </SectionHeadline>
          </div>

          <Gallery>
            {webTileProps.map((prop, idx) => (
              <Tile key={idx} {...prop} />
            ))}
          </Gallery>
        </Section>

        <Section>
          <div className="horizontal-pad">
            <SectionHeadline>
              <strong>CSS 공부 기록</strong>
            </SectionHeadline>
          </div>

          <Gallery>
            <CSSBookTile />
            {cssTileProps.map((prop, idx) => (
              <Tile key={idx} {...prop} />
            ))}
          </Gallery>
        </Section>

        <Section className="bg-lightgray">
          <SectionHeadline className="horizontal-pad">
            <strong>게시글</strong>
          </SectionHeadline>

          <PostContainer>
            {postTileProps.map((prop) => (
              <PostTile key={prop.title} {...prop} />
            ))}
          </PostContainer>
        </Section>

        <Section className="horizontal-pad pb-[64px]">
          <SectionHeadline>
            <strong>방명록 🙌</strong>
          </SectionHeadline>
          <Giscus />
        </Section>
      </main>
      <Footer />
    </>
  );
}

let Section = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <section
    className={`pt-[54px] sm:pt-[62px] md:pt-[71px] lg:pt-[87px] ${className}`}
  >
    {children}
  </section>
);

let projectList: WideTileProps[] = [
  {
    name: 'cse.snu.ac.kr',
    copy: '서울대학교 컴퓨터공학부 홈페이지 리뉴얼에 프론트엔드 개발자로 참여했어요.',
    href: 'https://cse.snu.ac.kr',
    bg: <CserealBg />,
  },
  {
    name: '@yeolyii',
    copy: '인스타그램 개발 계정에 개발 일상을 나눠요. 최근에 팔로워 1만명을 넘었습니다 🎉',
    href: 'https://instagram.com/yeolyii',
    bg: <InstaBg />,
  },
];

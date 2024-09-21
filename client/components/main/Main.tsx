import Giscus from '@/client/components/common/Giscus';

import Footer from '@/client/components/layout/Footer';
import profile from './assets/profile.jpg';

import { PostGrid } from './components/post/PostGrid';
import {
  TopSection,
  Headline,
  Copy,
  Section,
  SectionHeadline,
} from '@/client/components/main/components/Typography';
import { TileList } from '@/client/components/main/components/tile/TileList';
import { Tile, TileProps } from '@/client/components/main/components/tile/Tile';
import { jsPageList } from '@/client/mdx/js';
import { webapiPageList } from '@/client/mdx/webapi';
import {
  WideTile,
  WideTileProps,
} from '@/client/components/main/components/project/WideTile';
import { Carousel } from '@/client/components/main/components/project/Carousel';
import { CserealBg } from '@/client/components/main/components/project/CserealBg';
import InstaBg from '@/client/components/main/components/project/InstaBg';

export const MainPage = () => {
  return (
    <>
      <main>
        <img
          src={profile}
          alt="어렸을 때 사진"
          className="block h-[calc(100vh-350px)] max-h-[calc(((100vw*9)/16))] min-h-[calc(((100vw*9)/16)*0.57)] w-full object-cover"
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
          <Carousel>
            {projectList.map((prop) => (
              <WideTile key={prop.href} {...prop} />
            ))}
          </Carousel>
        </Section>

        <Section className="bg-lightgray">
          <SectionHeadline className="horizontal-pad">
            <strong>게시글</strong>
          </SectionHeadline>
          <PostGrid />
        </Section>

        <Section>
          <div className="horizontal-pad">
            <SectionHeadline>
              <strong>자바스크립트 공부 기록.</strong> 예제 코드를 수정하고
              실행해보세요.
            </SectionHeadline>
          </div>
          <TileList>
            {jsTileList.map((prop, idx) => (
              <Tile key={idx} {...prop} />
            ))}
          </TileList>
        </Section>

        <Section className="bg-lightgray">
          <div className="horizontal-pad">
            <SectionHeadline>
              <strong>Web API 공부 기록.</strong> 자바스크립트로 브라우저
              조작하기.
            </SectionHeadline>
          </div>
          <TileList>
            {webTileList.map((prop, idx) => (
              <Tile key={idx} {...prop} />
            ))}
          </TileList>
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
};

const jsTileList: TileProps[] = jsPageList.map((x) => ({
  ...x,
  url: x.path,
  style: {
    backgroundImage: `linear-gradient(
        163deg,
    hsl(51deg 97% 59%) 1%,
    hsl(50deg 93% 58%) 51%,
    hsl(49deg 90% 56%) 49%,
    hsl(48deg 86% 54%) 99%
  )`,
  },
  textColor: 'text-textblack',
}));

const webTileList: TileProps[] = webapiPageList.map((x) => ({
  ...x,
  url: x.path,
  textColor: 'text-white',
  style: { background: 'linear-gradient(to right, #232526, #414345)' },
}));

const projectList: WideTileProps[] = [
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

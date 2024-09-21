import Giscus from '@/client/components/common/Giscus';

import Footer from '@/client/components/layout/Footer';
import profile from './assets/profile.jpg';

import { Copy } from '@/client/components/main/components/Copy';
import { jsPageList } from '@/client/mdx/js';
import { webapiPageList } from '@/client/mdx/webapi';
import {
  Tile,
  TileProps,
} from '@/client/components/main/components/project/Tile';
import { Carousel } from '@/client/components/main/components/project/Carousel';
import { CserealBg } from '@/client/components/main/components/project/CserealBg';
import InstaBg from '@/client/components/main/components/project/InstaBg';
import { postPageList } from '@/client/mdx/post';
import List from '@/client/components/main/components/List';
import Section from '@/client/components/main/components/Section';

export const MainPage = () => {
  return (
    <>
      <main>
        <img
          src={profile}
          alt="어렸을 때 사진"
          className="block h-[calc(100vh-350px)] max-h-[calc(((100vw*9)/16))] min-h-[calc(((100vw*9)/16)*0.57)] w-full object-cover"
        />

        <Section.Top>
          <h1 className="mr-[30px] text-[40px] font-semibold leading-[1.2] text-textblack sm:text-[48px] sm:leading-[1.1875] md:text-[64px] md:leading-[1.171875] lg:text-[80px] lg:leading-[1.15]">
            이성열 yeolyi
          </h1>
          <Copy>
            프론트엔드 개발자 이성열입니다. 제가 배우고 경험한 것들을 다듬어
            이곳에 공유해요.
          </Copy>
        </Section.Top>

        <Section>
          <Carousel>
            {projectList.map((prop) => (
              <Tile key={prop.href} {...prop} />
            ))}
          </Carousel>
        </Section>

        <Section className="bg-lightgray">
          <List>
            {postPageList.map((mdxPage, idx) => (
              <List.Post key={idx} mdxPage={mdxPage} />
            ))}
          </List>
        </Section>

        <Section>
          <Section.Headline className="horizontal-pad">
            <strong>자바스크립트</strong>
          </Section.Headline>
          <List>
            {jsTileList.map((prop, idx) => (
              <List.JS key={idx} {...prop} />
            ))}
          </List>
        </Section>

        <Section className="bg-lightgray">
          <Section.Headline className="horizontal-pad">
            <strong>Web API</strong>
          </Section.Headline>
          <List>
            {webTileList.map((prop, idx) => (
              <List.WebAPI key={idx} {...prop} />
            ))}
          </List>
        </Section>

        <Section className="horizontal-pad pb-[64px]">
          <Giscus />
        </Section>
      </main>

      <Footer />
    </>
  );
};

const jsTileList = jsPageList.map((x) => ({ ...x, url: x.path }));

const webTileList = webapiPageList.map((x) => ({ ...x, url: x.path }));

const projectList: TileProps[] = [
  {
    name: 'cse.snu.ac.kr',
    copy: '서울대학교 컴퓨터공학부 홈페이지 리뉴얼에 참여했어요.',
    href: 'https://cse.snu.ac.kr',
    bg: <CserealBg />,
  },
  {
    name: '@yeolyii',
    copy: '인스타그램 개발 계정에 유익하고 바보같은 개발 일상을 나눠요.',
    href: 'https://instagram.com/yeolyii',
    bg: <InstaBg />,
  },
];

import Giscus from '@/client/components/common/Giscus';

import Footer from '@/client/components/layout/Footer';
import profile from './assets/profile.jpg';

import { jsPageList } from '@/client/mdx/js';
import { webapiPageList } from '@/client/mdx/webapi';
import { CserealBg } from '@/client/pages/components/CserealBg';
import InstaBg from '@/client/pages/components/InstaBg';
import { postPageList } from '@/client/mdx/post';
import List from '@/client/pages/components/List';
import Section from '@/client/pages/components/Section';
import Project from '@/client/pages/components/Project';

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
          <p className="mt-[10px] w-auto max-w-[430px] text-[19px] font-semibold leading-[1.32] tracking-[0.012em] text-textblack min-[590px]:max-w-[535px] lg:w-[390px] lg:text-[21px]">
            배우고 경험한 것들을 다듬어 여기에 공유해요. 카카오에서 프론트엔드
            개발을 하고 있어요. 서울대학교 컴퓨터공학부 복수전공 중입니다.
          </p>
        </Section.Top>

        <Section>
          <Project>
            {projectList.map((prop) => (
              <Project.Cell key={prop.href} {...prop} />
            ))}
          </Project>
        </Section>

        <Section className="bg-lightgray">
          <Section.Headline className="horizontal-pad">
            <strong>게시물</strong>
          </Section.Headline>
          <List>
            {postPageList.map((mdxPage, idx) => (
              <List.Post key={idx} mdxPage={mdxPage} />
            ))}
          </List>
        </Section>

        <Section>
          <Section.Headline className="horizontal-pad">
            <strong>자바스크립트</strong> 공부 기록
          </Section.Headline>
          <List>
            {jsPageList.map((prop, idx) => (
              <List.JS key={idx} {...prop} />
            ))}
          </List>
        </Section>

        <Section className="bg-lightgray">
          <Section.Headline className="horizontal-pad">
            <strong>Web API</strong> 공부 기록
          </Section.Headline>
          <List>
            {webapiPageList.map((prop, idx) => (
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

const projectList = [
  {
    name: 'cse.snu.ac.kr',
    copy: '서울대학교 컴퓨터공학부 홈페이지 리뉴얼에 프론트엔드 개발자로 참여중입니다.',
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

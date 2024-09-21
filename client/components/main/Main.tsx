import Giscus from '@/client/components/common/Giscus';

import Footer from '@/client/components/layout/Footer';
import { JSCarousel } from '@/client/components/main/components/JSCarousel';
import profile from './profile.jpg';

import { PostGrid } from './components/PostGrid';
import { WebCarousel } from './components/WebCarousel';
import { ProjectCarousel } from './components/ProjectCarousel';
import {
  TopSection,
  Headline,
  Copy,
  Section,
  SectionHeadline,
} from '@/client/components/main/components/Typography';

export let MainPage = () => {
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
          <ProjectCarousel />
        </Section>

        <Section>
          <div className="horizontal-pad">
            <SectionHeadline>
              <strong>자바스크립트 공부 기록.</strong> 예제 코드를 수정하고
              실행해보세요.
            </SectionHeadline>
          </div>
          <JSCarousel />
        </Section>

        <Section>
          <div className="horizontal-pad">
            <SectionHeadline>
              <strong>Web API 공부 기록.</strong> 자바스크립트로 브라우저
              조작하기.
            </SectionHeadline>
          </div>
          <WebCarousel />
        </Section>

        <Section className="bg-lightgray">
          <SectionHeadline className="horizontal-pad">
            <strong>게시글</strong>
          </SectionHeadline>
          <PostGrid />
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

'use client';

import Image from 'next/image';
import { Gallery, WideTile, Tile } from './Gallery';
import { jsProps, projectProps } from './contents';
import './main.css';
import profile from '@/public/profile.jpg';

export default function Page() {
  return (
    <main>
      <Image src={profile} alt="어렸을 때 사진" className="profile" />

      <section className="horizontal-pad">
        <h1 className="headline">이성열 yeolyi</h1>
        <p className="copy">
          <strong>
            배우고 익히는 재미로 살아요. 제가 배운 것과 경험한 것들을 다듬어
            이곳에 공유합니다.
          </strong>{' '}
          카카오에 프론트엔드 개발자로 입사 예정이에요.{' '}
          <a href="https://github.com/yeolyi">GitHub</a>
        </p>
      </section>

      <section>
        <h2 className="section-headline horizontal-pad">
          <strong>프로젝트</strong>
        </h2>

        <Gallery wide>
          {projectProps.map((prop) => (
            <WideTile key={prop.href} {...prop} />
          ))}
        </Gallery>
      </section>

      <section>
        <div className="horizontal-pad">
          <h2 className="section-headline">
            실행되는 예제 코드를 준비한 <strong>자바스크립트 공부 기록</strong>
          </h2>
        </div>

        <Gallery>
          {jsProps.map((prop) => (
            <Tile key={prop.href} {...prop} />
          ))}
        </Gallery>
      </section>
    </main>
  );
}

'use client';

import { Gallery, WideTile, Tile } from './Gallery';
import { jsProps, projectProps } from './contents';
import './main.css';

export default function Page() {
  return (
    <main>
      <section className="horizontal-pad">
        <h1 className="headline">이성열 yeolyi</h1>
        <p className="copy">
          배우고 익히는 재미로 사는 개발자입니다. 이 블로그에는 제가 배운 것과
          경험한 것들을 다듬어 공유해요.
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

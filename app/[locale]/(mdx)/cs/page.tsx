import { getSubscriberCount } from '@/actions/resend';
import Comment from '@/components/comment';
import CSPostListItem from '@/components/cs/CSPostListItem';
import EmailSubscribe from '@/components/cs/EmailSubscribe';
import PixelateImage from '@/components/cs/PixelateImage';
import TruthTable from '@/components/cs/TruthTable';
import Flow from '@/components/cs/flow';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import initialJSON from './assets/flow.json';

export const metadata: Metadata = {
  title: '만들면서 배우는 컴퓨터공학',
  description: '작은 것들이 모여 컴퓨터가 만들어지는 과정을 함께 따라가봐요!',
  keywords: [
    '논리설계',
    '컴퓨터 구조',
    '자료구조',
    '알고리즘',
    '운영체제',
    '네트워크',
  ],
};

export default async function Home() {
  const t = await getTranslations('HomePage');
  const tCS = await getTranslations('Curriculum');
  const tEmail = await getTranslations('EmailSubscribe');
  const subscriberCount = await getSubscriberCount();
  const count = subscriberCount.success ? subscriberCount.value : undefined;

  return (
    <div className="prose prose-invert prose-stone">
      <h1>{t('curriculum')}</h1>
      <p>{t('curriculumIntro1')}</p>
      <p>{t('curriculumIntro2')}</p>
      <p>{t('curriculumIntro3')}</p>

      <h2>{tEmail('title')}</h2>
      <p>
        {tEmail('description')}{' '}
        {count !== undefined && tEmail('subscriberCount', { count })}
      </p>

      <EmailSubscribe />

      <Border />

      <h2>{tCS('part1Title')}</h2>

      <div className="flex flex-col gap-6">
        <CSPostListItem
          title={tCS('hw1Title')}
          description={tCS('hw1Description')}
          date="2025-05-04"
          href="/cs/zero-and-one"
        >
          <PixelateImage />
        </CSPostListItem>

        <CSPostListItem
          title={tCS('hw2Title')}
          description={tCS('hw2Description')}
          date="2025-05-11"
          href="/cs/and-or-not"
        >
          <TruthTable
            labels={[
              { label: 'A', type: 'input' },
              { label: 'B', type: 'input' },
              { label: 'A AND B', type: 'output' },
            ]}
            data={[
              [false, false, false],
              [false, true, false],
              [true, false, false],
              [true, true, true],
            ]}
          />
        </CSPostListItem>

        <CSPostListItem
          title={tCS('hw3Title')}
          description={tCS('hw3Description')}
          date="2025-05-25"
          href="/cs/nand-is-all-you-need"
        >
          <Flow id="/cs" initialJSON={initialJSON} height={250} />
        </CSPostListItem>

        <CSPostListItem
          title={tCS('hw4Title')}
          description={tCS('hw4Description')}
          date="2025-06-01"
        />

        {[...Array(4)].map((_, idx) => (
          <CSPostListItem
            key={idx}
            // @ts-expect-error
            title={tCS(`hw${idx + 5}Title`)}
            // @ts-expect-error
            description={tCS(`hw${idx + 5}Description`)}
          />
        ))}
      </div>

      <h2>{tCS('part2Title')}</h2>
      <div className="flex flex-col gap-6">
        {[...Array(7)].map((_, idx) => (
          <CSPostListItem
            key={idx}
            // @ts-expect-error
            title={tCS(`ds${idx + 1}Title`)}
            // @ts-expect-error
            description={tCS(`ds${idx + 1}Description`)}
          />
        ))}
      </div>

      <h2>{tCS('part3Title')}</h2>
      <div className="flex flex-col gap-6">
        {[...Array(6)].map((_, idx) => (
          <CSPostListItem
            key={idx}
            // @ts-expect-error
            title={tCS(`os${idx + 1}Title`)}
            // @ts-expect-error
            description={tCS(`os${idx + 1}Description`)}
          />
        ))}
      </div>

      <h2>{tCS('appendixTitle')}</h2>
      <div className="flex flex-col gap-6">
        <CSPostListItem title={tCS('appendix1Title')} description={''} />
      </div>

      <Border />

      <h2>여러분들 의견이 궁금해요</h2>
      <p>
        이 시리즈를 읽으면서 떠오른 궁금한 점이나 나누고 싶은 의견이 있다면
        언제든지 아래 댓글로 남겨주세요. 예를 들면...
      </p>
      <ul>
        <li>
          컴퓨터 공학 분야에서 '이건 왜 이렇게 될까?' 등 평소에 궁금하셨던 것
        </li>
        <li>컴퓨터 공학을 공부하면서 인상 깊었던 개념</li>
        <li>
          다들 중요하다고는 하는데, 솔직히 아직 이게 왜 필요한지, 어떻게
          쓰이는지 잘 모르겠다 싶은 개념
        </li>
      </ul>
      <p>
        여러분의 질문, 경험, 솔직한 어려움을 나눠주시면 다른 독자분들에게도
        도움이 될 것이라 믿습니다. 함께 배우고 성장하는 공간이 될 수 있도록 저도
        계속 고민할게요 :)
      </p>
      <p className="italic text-stone-400 mb-12">
        * 스팸 방지를 위해 깃허브 로그인 후 작성할 수 있어요
      </p>
      <Comment postId="index" />
    </div>
  );
}

const Border = () => <div className="border-t border-white/20 my-12" />;

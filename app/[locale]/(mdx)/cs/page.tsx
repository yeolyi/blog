import { getSubscriberCount } from '@/actions/resend';
import Comment from '@/components/comment';
import CSPostListItem from '@/components/cs/CSPostListItem';
import EmailSubscribe from '@/components/cs/EmailSubscribe';
import PixelateImage from '@/components/cs/PixelateImage';
import TruthTable from '@/components/cs/TruthTable';
import Flow from '@/components/cs/flow';
import { border } from '@/components/ui/theme';
import half from '@/mdx/cs/adder/assets/half.json';
import not from '@/mdx/cs/nand-is-all-you-need/assets/not.json';
import EdgeTriggerDemo from '@/mdx/cs/sequential/components/EdgeTriggerDemo';
import AddingTuringMachine from '@/mdx/cs/turing-machine/components/AddingTuringMachine';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

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

      <h2>{tEmail('title')}</h2>
      <p>
        {tEmail('description')}{' '}
        {count !== undefined && tEmail('subscriberCount', { count })}
      </p>

      <EmailSubscribe />

      <Border />

      <h2>{tCS('part1Title')}</h2>

      <div className="flex flex-col gap-12">
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
          <div className={clsx('flex justify-center py-4', border)}>
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
          </div>
        </CSPostListItem>

        <CSPostListItem
          title={tCS('hw3Title')}
          description={tCS('hw3Description')}
          date="2025-05-25"
          href="/cs/nand-is-all-you-need"
        >
          <Flow id="/cs" initialJSON={not} height={250} />
        </CSPostListItem>

        <CSPostListItem
          title={tCS('hw4Title')}
          description={tCS('hw4Description')}
          date="2025-06-01"
          href="/cs/adder"
        >
          <Flow
            id="ripple-carry-adder"
            initialJSON={half}
            additionalRegistryKeys={['or', 'halfAdder', 'fullAdder']}
            height={300}
          />
        </CSPostListItem>

        <CSPostListItem
          title={tCS('hw5Title')}
          description={tCS('hw5Description')}
          date="2025-06-15"
          href="/cs/sequential"
        >
          <EdgeTriggerDemo />
        </CSPostListItem>

        <CSPostListItem
          title={tCS('hw6Title')}
          description={tCS('hw6Description')}
          date="2025-06-22"
          href="/cs/turing-machine"
        >
          <AddingTuringMachine />
        </CSPostListItem>

        {[...Array(2)].map((_, idx) => (
          <CSPostListItem
            key={idx}
            // @ts-expect-error
            title={tCS(`hw${idx + 7}Title`)}
            // @ts-expect-error
            description={tCS(`hw${idx + 7}Description`)}
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

      <Comment postId="index" />
    </div>
  );
}

const Border = () => <div className="border-t border-white/20 my-12" />;

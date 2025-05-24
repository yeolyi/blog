import localFont from 'next/font/local';

// css가 script 태그로 들어가서 mdx 안에서 import해서 그런건가싶어서 여기로 이동
import '@xyflow/react/dist/style.css';
import 'medium-zoom/dist/style.css';
import '../../../components/cs/flow/style.css';

const monoplexKR = localFont({
  src: './assets/MonoplexKR-Text.ttf',
  variable: '--font-monoplex-kr',
});

export default async function PostLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  return (
    <div
      className={`${monoplexKR.variable} w-2xl max-w-full mx-auto mt-[12vh] mb-32 px-4 grow`}
    >
      {children}
    </div>
  );
}

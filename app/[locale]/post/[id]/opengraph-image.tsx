import meImage from '@/app/[locale]/assets/me.jpg';
import { ImageResponse } from 'next/og';

export const alt = '블로그 포스트 오픈그래프 이미지';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function OGImage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const { id, locale } = params;

  const mdxModule = await import(`@/mdx/${id}/${locale}.mdx`);
  const { title } = mdxModule;

  const headerText = locale === 'ko' ? '개발자 성열' : 'seongyeol Yi';
  const fontText = `${headerText} ${title} 개발자 성열 seongyeol Yi`;
  const fontData = await loadGoogleFont(
    'IBM+Plex+Sans+KR:wght@700;800',
    fontText,
  );

  return new ImageResponse(
    <OGLayout>
      <TitleArea title={title} />
      <HeaderArea headerText={headerText} />
    </OGLayout>,
    {
      ...size,
      fonts: [
        {
          name: 'IBM Plex Sans KR',
          data: fontData,
          style: 'normal',
          weight: 800,
        },
      ],
    },
  );
}

function OGLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        color: 'white',
        padding: '60px',
        fontFamily: 'IBM Plex Sans KR',
      }}
    >
      {children}
    </div>
  );
}

function TitleArea({ title }: { title: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        textAlign: 'left',
        fontSize: '80px',
        fontWeight: 800,
        lineHeight: 1.2,
        maxWidth: '80%',
        wordBreak: 'keep-all',
        overflowWrap: 'break-word',
        textWrap: 'balance',
        letterSpacing: '-0.03em',
      }}
    >
      {title}
    </div>
  );
}

function HeaderArea({
  headerText,
  profileImageUrl,
}: {
  headerText: string;
  profileImageUrl?: string;
}) {
  return (
    <>
      {/* 하단 여백 */}
      <div />

      {/* 좌하단 헤더 영역 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '15px',
        }}
      >
        <span
          style={{
            fontSize: '42px',
            fontWeight: 700,
          }}
        >
          {headerText}
        </span>
        {profileImageUrl && (
          <img
            src={profileImageUrl}
            width={50}
            height={50}
            alt="프로필 이미지"
            style={{
              borderRadius: '6px',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
    </>
  );
}

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype|woff2?)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error('폰트 데이터 로드 실패');
}

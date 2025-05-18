import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('이미지 URL이 제공되지 않았습니다.', {
      status: 400,
    });
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new NextResponse('이미지를 불러오는데 실패했습니다.', {
        status: response.status,
      });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('이미지 프록시 오류:', error);
    return new NextResponse('이미지 처리 중 오류가 발생했습니다.', {
      status: 500,
    });
  }
}

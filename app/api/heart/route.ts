import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const param = request.nextUrl.searchParams;
	const id = param.get('id');

	if (!id) {
		return new NextResponse('ID가 필요합니다', { status: 400 });
	}

	// SVG 문자열 생성
	const svg = generateUserHeartSVG(id);

	return new NextResponse(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'no-store',
		},
	});
}

function stringToColor(userId: string): { h: number; s: number; l: number } {
	const hash = [...userId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
	const h = hash % 360; // 색조
	const s = 60 + (hash % 20); // 60~80%
	const l = 50 + ((hash >> 3) % 10); // 50~59%
	return { h, s, l };
}

function generateUserHeartSVG(userId: string): string {
	const { h, s, l } = stringToColor(userId);
	const stroke = `hsl(${h}, ${s}%, ${l}%)`;

	return `
<svg 
  width="24" 
  height="24" 
  xmlns="http://www.w3.org/2000/svg" 
  fill-rule="evenodd" 
  clip-rule="evenodd"
  stroke="${stroke}"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/>
</svg>
`.trim();
}

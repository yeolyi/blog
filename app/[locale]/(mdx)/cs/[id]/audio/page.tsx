import { generateCSMetadata } from '@/app/[locale]/(mdx)/cs/utils/generateCSMetadata';
import { Link } from '@/i18n/navigation';

export const generateMetadata = generateCSMetadata;

export default async function AudioPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return (
		<div className='prose prose-invert'>
			{/* biome-ignore lint/a11y/useMediaCaption: 캡션이 없어 */}
			<audio controls>
				<source src={`/cs/${id}/audio.wav`} type='audio/wav' />
			</audio>
			<p>AI로 생성해본 팟캐스트 파일입니다☺️</p>
			<p>
				<Link href={`/cs/${id}`}>글 보러가기</Link>
			</p>
		</div>
	);
}

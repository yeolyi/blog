import Marquee from '@/components/Marquee';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function CS() {
	return (
		<div className='px-4 max-w-2xl mx-auto flex flex-col gap-7'>
			<Marquee>nand is more than just </Marquee>
			<p>
				<Button asChild variant='link'>
					<Link href='/'>/</Link>
				</Button>
				으로 위치를 옮겼습니다.
			</p>
		</div>
	);
}

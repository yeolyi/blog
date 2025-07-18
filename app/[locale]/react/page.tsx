import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import {
	hookOrder,
	initialRenderOreder,
	prepareOrder,
	rerenderOrder,
} from '@/mdx/react';

export default async function React() {
	const reactPrepareList = await Promise.all(
		prepareOrder.map(async (id) => {
			const { default: _, ...metadata } = await import(`@/mdx/react/${id}/ko.mdx`);
			return { id, ...metadata };
		}),
	);

	const reactInitialRenderList = await Promise.all(
		initialRenderOreder.map(async (id) => {
			const { default: _, ...metadata } = await import(`@/mdx/react/${id}/ko.mdx`);
			return { id, ...metadata };
		}),
	);

	const reactRerenderList = await Promise.all(
		rerenderOrder.map(async (id) => {
			const { default: _, ...metadata } = await import(`@/mdx/react/${id}/ko.mdx`);
			return { id, ...metadata };
		}),
	);

	const reactHookList = await Promise.all(
		hookOrder.map(async (id) => {
			const { default: _, ...metadata } = await import(`@/mdx/react/${id}/ko.mdx`);
			return { id, ...metadata };
		}),
	);

	return (
		<div className='px-4 mx-auto flex flex-col gap-7 max-w-6xl'>
			<div className='aspect-video flex items-center justify-center select-none min-h-[384px] w-full'>
				<p className='text-[min(6vw,70px)] leading-none font-extrabold text-center'>
					<span className='opacity-10'>performWorkUntilDeadline</span>
					<br />
					<span className='opacity-30'>renderRootSync</span>
					<br />
					<span className='opacity-50'>workLoopSync</span>
					<br />
					<span className='opacity-70'>updateFunctionComponent</span>
					<br />
					<span className='opacity-90'>renderWithHooks</span>
					<br />
					...&lt;App /&gt;
				</p>
			</div>

			<div className='flex flex-col gap-7'>
				<p className='font-extrabold'>「시작하기 앞서」</p>
				<p>
					{reactPrepareList.map(({ id, title }) => (
						<GhostButton href={`/react/${id}`} key={id}>
							{title}
						</GhostButton>
					))}
				</p>
				<p className='font-extrabold'>「첫 렌더링」</p>
				<p>
					{reactInitialRenderList.map(({ id, title }) => (
						<GhostButton href={`/react/${id}`} key={id}>
							{title}
						</GhostButton>
					))}
				</p>
				<p className='font-extrabold'>「리렌더링」</p>
				<p>
					{reactRerenderList.map(({ id, title }) => (
						<GhostButton href={`/react/${id}`} key={id}>
							{title}
						</GhostButton>
					))}
				</p>
				<p className='font-extrabold'>「리액트 훅」</p>
				<p>
					{reactHookList.map(({ id, title }) => (
						<GhostButton href={`/react/${id}`} key={id}>
							{title}
						</GhostButton>
					))}
				</p>
			</div>
		</div>
	);
}

const GhostButton = ({
	href,
	children,
}: {
	href?: string;
	children: React.ReactNode;
}) => {
	return (
		<Button variant='ghost' asChild={!!href} disabled={!href} className='gap-1'>
			{href ? (
				<Link href={href} className='truncate max-w-full'>
					{children}
				</Link>
			) : (
				<span className='truncate'>{children}</span>
			)}
		</Button>
	);
};

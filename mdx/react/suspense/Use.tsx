import { Suspense, use } from 'react';

const fetch = () =>
	new Promise<string>((resolve) => setTimeout(() => resolve('data'), 1000));

function Child() {
	const data = use(fetch());
	return <div>{data}</div>;
}

export default function Use() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Child />
		</Suspense>
	);
}

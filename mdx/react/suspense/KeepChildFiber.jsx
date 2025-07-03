'use client';

import { Suspense, useState } from 'react';

const getResource = (data, delay = 1000) => ({
	_data: null,
	_promise: null,
	status: 'pending',
	get data() {
		if (this.status === 'ready') {
			return this._data;
		}

		if (this._promise == null) {
			this._promise = new Promise((resolve) => {
				setTimeout(() => {
					this._data = data;
					this.status = 'ready';
					resolve();
				}, delay);
			});
		}
		throw this._promise;
	},
});

const Child = ({ resource }) => {
	const [count, setCount] = useState(0);
	return (
		<div>
			<div>{JSON.stringify(resource)}</div>
			<button type='button' onClick={() => setCount(count + 1)}>
				count: {count}
			</button>
		</div>
	);
};

export default function SuspenseDemo() {
	const [resource, setResource] = useState(null);
	return (
		<div className='app'>
			<button
				type='button'
				onClick={() => {
					setResource(getResource('JSer'));
				}}
			>
				start
			</button>
			<Suspense fallback={<p>loading...</p>}>
				<Child resource={resource} />
			</Suspense>
		</div>
	);
}

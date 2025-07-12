'use client';

import dynamic from 'next/dynamic';

const Code = dynamic(() => import('./_Code'), {
	ssr: false,
});

export default Code;

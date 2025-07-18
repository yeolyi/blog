'use client';

import useSWR from 'swr';
import { getInstagramFollowers } from '@/actions/instagram';

export default function InstagramFollowerCount() {
	const { data } = useSWR('/api/instagram/followers', () =>
		getInstagramFollowers(),
	);

	if (!data?.success) return '-';

	return data.value.followers_count.toLocaleString();
}

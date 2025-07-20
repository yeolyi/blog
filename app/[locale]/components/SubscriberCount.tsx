'use client';

import { useSubscribers } from '@/swr/subscriber';

export default function SubscriberCount() {
	const { data } = useSubscribers();
	if (!data?.success || !data.value) return '-';
	return data.value.toLocaleString();
}

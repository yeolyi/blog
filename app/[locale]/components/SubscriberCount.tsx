import { delay } from 'es-toolkit';
import { getSubscriberCount } from '@/actions/resend';

export default async function SubscriberCount() {
	const data = await getSubscriberCount();
	if (!data?.success || !data.value) return '-';
	return data.value.toLocaleString();
}

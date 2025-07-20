import useSWR from 'swr';
import { getSubscriberCount } from '@/actions/resend';
import { subscriberKey } from './key';

export const useSubscribers = () => {
	return useSWR(subscriberKey, getSubscriberCount);
};

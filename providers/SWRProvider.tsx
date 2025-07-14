'use client';
import { toast } from 'sonner';
import { SWRConfig } from 'swr';

export default function SWRProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SWRConfig
			value={{
				onError: (error) => {
					toast.error(error.message);
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}

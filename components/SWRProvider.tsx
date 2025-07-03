'use client';
import { toast } from 'react-toastify';
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

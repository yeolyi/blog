import { Suspense } from 'react';

// useSearchParams() should be wrapped in a suspense boundary at page "/[locale]/memes/select". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
export default function SelectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}

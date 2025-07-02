import { Skeleton } from '@/components/ui/skeleton';

export default async function Loading() {
  return (
    // TODO: 하드코딩 없애기
    <div className="flex flex-col gap-3 w-full">
      <Skeleton className="w-3/4 h-[50px] mb-[32px]" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-1/2 h-6" />
    </div>
  );
}

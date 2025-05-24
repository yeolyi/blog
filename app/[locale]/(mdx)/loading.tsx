export default async function Loading() {
  return (
    <div className="prose w-full flex flex-col gap-3">
      <div className="w-3/4 h-[50px] mb-[32px] bg-stone-700 animate-pulse rounded-md" />
      <div className="w-full h-6 bg-stone-700 animate-pulse rounded-md" />
      <div className="w-full h-6 bg-stone-700 animate-pulse rounded-md" />
      <div className="w-full h-6 bg-stone-700 animate-pulse rounded-md" />
      <div className="w-1/2 h-6 bg-stone-700 animate-pulse rounded-md" />
      <p className="opacity-0">
        이거 어떻게 없애지 이거 어떻게 없애지 이거 어떻게 없애지 이거 어떻게
        없애지
      </p>
    </div>
  );
}

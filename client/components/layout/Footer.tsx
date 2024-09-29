import { Follower, Star } from '@/client/components/layout/Badge';

export default function Footer() {
  return (
    <footer className="border-gray-600 bg-lightgray dark:border-t dark:bg-black">
      <div className="horizontal-pad flex flex-col items-center justify-end gap-3 py-4 sm:flex-row">
        <div className="flex gap-3">
          <Star />
          <Follower />
        </div>
      </div>
    </footer>
  );
}

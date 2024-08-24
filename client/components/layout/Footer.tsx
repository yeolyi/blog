import { Follower, Star } from '@/client/components/layout/Badge';

export default function Footer() {
  return (
    <footer className="bg-lightgray">
      <div className="horizontal-pad flex flex-col items-center justify-between gap-3 py-4 sm:flex-row">
        <div className="flex gap-4 text-sm font-normal text-textblack underline">
          <a href="https://github.com/yeolyi">GitHub</a>
          <a href="https://instagram.com/yeolyii">Instagram</a>
        </div>
        <div className="flex gap-3">
          <Star />
          <Follower />
        </div>
      </div>
    </footer>
  );
}

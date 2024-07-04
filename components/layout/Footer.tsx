import Link from 'next/link';
import Star from './Star';
import Follower from './Follower';

export default function Footer() {
  return (
    <footer className="bg-lightgray">
      <div className="horizontal-pad flex flex-col items-center justify-between gap-3 py-4 sm:flex-row">
        <div className="flex gap-4 text-sm font-normal text-textblack underline">
          <Link href="https://github.com/yeolyi">GitHub</Link>
          <Link href="https://instagram.com/yeolyii">Instagram</Link>
        </div>
        <div className="flex gap-3">
          <Star />
          <Follower />
        </div>
      </div>
    </footer>
  );
}

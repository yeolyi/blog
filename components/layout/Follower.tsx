import { FaInstagram } from 'react-icons/fa6';
import { getFollowerCnt } from '@/api/instagram';
import { Badge } from './Badge';

export default async function Follower({ className }: { className?: string }) {
  let cnt = await getFollowerCnt();
  let href = 'https://instagram.com/yeolyii';

  return (
    <Badge
      title="follower"
      icon={<FaInstagram className="text-[16px]" />}
      cnt={cnt}
      href={href}
      className={className}
    />
  );
}

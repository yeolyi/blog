import FooterBadge from './FooterBadge';
import { FaInstagram } from 'react-icons/fa6';
import { getFollowerCnt } from '@/api/instagram';

export default async function Follower() {
  let cnt = await getFollowerCnt();
  let href = 'https://instagram.com/yeolyii';

  return (
    <FooterBadge
      title="follower"
      icon={<FaInstagram className="text-[16px]" />}
      cnt={cnt}
      href={href}
    />
  );
}

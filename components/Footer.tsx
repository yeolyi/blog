import Link from 'next/link';
import { GitHub, Icon, Instagram } from 'react-feather';

export default function Footer() {
  return (
    <footer className="font-firacode mt-20">
      <hr className="mt-20 mb-4" />
      <div className="flex items-center justify-between mr-3">
        <div>
          <Link
            href="/"
            className="no-underline"
          >
            YeolYi
          </Link>
          <p className="m-0">© 2023 YeolYi Powered by Next.js & Tailwind</p>
        </div>

        <div className="flex gap-4">
          <IconAnchor
            Icon={Instagram}
            href="https://instagram.com/yeolyii"
          />
          <IconAnchor
            Icon={GitHub}
            href="https://github.com/yeolyi"
          />
        </div>
      </div>
    </footer>
  );
}

const IconAnchor = ({ Icon, href }: { Icon: Icon; href: string }) => {
  return (
    <a
      className="no-underline"
      href={href}
    >
      <Icon
        size={24}
        stroke="rgb(229, 231, 235)"
      />
    </a>
  );
};

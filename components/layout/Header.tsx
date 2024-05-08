'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { IconContext } from 'react-icons';
import { FaGithubAlt, FaInstagram } from 'react-icons/fa';
import { GoRelFilePath } from 'react-icons/go';

export default function Header() {
  return (
    <IconContext.Provider value={{ className: 'w-6 h-6' }}>
      <div className="absolute -top-10 left-0 flex justify-center gap-2">
        <StyledLink href="/">
          <GoRelFilePath />
        </StyledLink>
        <StyledLink href="https://github.com/yeolyi">
          <FaGithubAlt />
        </StyledLink>
        <StyledLink href="https://instagram.com/yeolyii">
          <FaInstagram />
        </StyledLink>
      </div>
    </IconContext.Provider>
  );
}

const StyledLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <Link
    href={href}
    className="flex h-8 w-8 items-center justify-center text-neutral-400 hover:text-neutral-800"
  >
    {children}
  </Link>
);

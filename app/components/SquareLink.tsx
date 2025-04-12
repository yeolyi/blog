import type React from 'react';
import Link, { type LinkProps } from 'next/link';

interface SquareLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

const SquareLink = ({
  children,
  className = '',
  ...props
}: SquareLinkProps) => {
  return (
    <Link
      {...props}
      className={`text-black bg-white border-none cursor-pointer text-lg font-semibold hover:bg-black hover:text-white ${className}`}
    >
      {children}
    </Link>
  );
};

export default SquareLink;

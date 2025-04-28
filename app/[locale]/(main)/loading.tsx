'use client';

import { usePathname } from '@/i18n/navigation';
import Image from 'next/image';
import Link from 'next/link';
import me from '../assets/me.jpg';

export default function Loading() {
  const path = usePathname();
  if (path !== '/') return <div className="grow" />;

  return (
    <div className="max-w-2xl mx-auto my-24 px-4 flex flex-col gap-16">
      <div className="relative w-full aspect-square mx-auto">
        <Image src={me} alt="me" className="object-cover w-full h-full" />
        <div className="flex flex-col gap-2 absolute bottom-5 left-5">
          <Link
            href="https://github.com/yeolyi/blog"
            className="block text-white text-2xl font-semibold bg-black w-fit hover:bg-white hover:text-black"
          >
            GitHub
          </Link>
          <Link
            href="https://www.instagram.com/yeol.dev"
            className="block text-white text-2xl font-semibold bg-black w-fit hover:bg-white hover:text-black"
          >
            Instagram
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="w-full h-6 bg-gray-700 animate-pulse rounded-md" />
        <div className="w-full h-6 bg-gray-700 animate-pulse rounded-md" />
        <div className="w-1/2 h-6 bg-gray-700 animate-pulse rounded-md" />
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Me from "@/public/me.jpg";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathName = usePathname();

  return (
    <header className="not-prose flex gap-4 items-center mb-12 ">
      <a href="/">
        <Image
          src={Me}
          alt="주인장 사진"
          width={80}
          height={80}
          className="m-0 object-contain rounded-full border-2 border-slate-300"
          priority
        />
      </a>

      <div className="flex flex-col gap-2">
        <a href="/" className="no-underline">
          <h2 className="text-2xl font-bold text-white">개발자 성열</h2>
        </a>
        <div className="flex gap-4">
          <NavAnchor href="/" current={pathName === "/"} text="About" />
          <NavAnchor
            href="/docs"
            current={pathName.startsWith("/docs")}
            text="Docs"
          />
        </div>
      </div>
    </header>
  );
}

const NavAnchor = ({
  text,
  current,
  href,
}: {
  text: string;
  current: boolean;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className={`text-slate-300 text-base font-medium ${
        current && "underline"
      }`}
    >
      {text}
    </Link>
  );
};

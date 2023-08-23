"use client";

import Image from "next/image";
import Me from "@/public/me.jpg";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathName = usePathname();

  return (
    <header className="not-prose flex gap-6 items-center mb-12 ">
      <a href="/">
        <Image
          src={Me}
          alt="주인장 사진"
          width={80}
          height={80}
          className="m-0 object-contain rounded"
          priority
        />
      </a>
      <div className="flex flex-col gap-2">
        <a href="/" className="no-underline">
          <h2 className="text-2xl font-bold text-white">개발자 성열</h2>
        </a>
        <div className="flex gap-4">
          <a
            href="/"
            className={`text-slate-300 text-base font-medium ${
              pathName !== "/" && "no-underline hover:underline"
            }`}
          >
            About
          </a>
          <a
            href="/docs"
            className={`text-slate-300 text-base font-medium ${
              !pathName.startsWith("/docs") && "no-underline hover:underline"
            }`}
          >
            Docs
          </a>
        </div>
      </div>
    </header>
  );
}

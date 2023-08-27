import { MarkGithubIcon } from "@primer/octicons-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <hr className="mt-20 mb-4" />
      <div className="flex items-center justify-between mr-3">
        <div>
          <Link href="/" className="no-underline">
            개발자 성열
          </Link>
          <p className="m-0">© 2023 YeolYi Powered by Next.js & Tailwind css</p>
        </div>
        <div className="flex gap-4">
          <a className="no-underline" href="https://github.com/yeolyi">
            <MarkGithubIcon size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}

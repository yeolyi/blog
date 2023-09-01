import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-4">
      <div className="flex items-center justify-between mr-3">
        <div className="flex flex-col gap-1">
          <Link
            href="/"
            className="no-underline font-bold leading-none text-white"
          >
            YeolYi
          </Link>
          <p className="m-0 leading-none text-gray-300">Powered by Next.js & Tailwind</p>
        </div>

        <div className="flex gap-4 ">
          <a href="https://instagram.com/yeolyii">Instagram</a>
          <a href="https://github.com/yeolyi">GitHub</a>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <h1>블로그</h1>
      <Link href="/memes">밈 목록</Link>
    </div>
  );
}

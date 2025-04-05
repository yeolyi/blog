import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <h1>블로그</h1>
      <Link href="/memes">밈 목록</Link>
      <h2>글 목록</h2>
      <ul>
        <li>
          <Link href="/post/sample">샘플 글</Link>
        </li>
      </ul>
    </div>
  );
}

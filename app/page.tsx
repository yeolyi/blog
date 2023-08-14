import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h2>블로그 개발 중!</h2>
      <h3>여기는 메인</h3>
      <Link href="post">글 보러가기</Link>
    </main>
  );
}

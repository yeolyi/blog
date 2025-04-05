import { signOut, signInWithGithub } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Header() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Link href="/">블로그</Link>
      <div style={{ display: "flex", gap: "1rem" }}>
        {user.user?.email}
        {user.user ? (
          <button onClick={signOut}>로그아웃</button>
        ) : (
          <button onClick={signInWithGithub}>로그인</button>
        )}
      </div>
    </header>
  );
}

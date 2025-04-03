import { signInWithGithub, signOut } from "@/app/private/actions";
import { createClient } from "@/utils/supabase/client";

export default async function PrivatePage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  return (
    <>
      <p>
        {JSON.stringify(data, null, 2)}
        <br />
        {JSON.stringify(error, null, 2)}
      </p>
      <button onClick={signInWithGithub}>Sign In</button>
      <button onClick={signOut}>Sign Out</button>
    </>
  );
}

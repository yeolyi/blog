import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

//  These utility functions(client & server) adapt
// @supabase/ssr's cookie handling for Next.js.
// You need to reconfigure the fetch call anew for every request to your server, 
// because you need the cookies from the request.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // You can safely ignore this error because you'll set up 
            // middleware in the next step to write refreshed cookies to storage.
            /*
             * When working with cookies in Server Components, it's important to understand that cookies are
             * fundamentally a client-side storage mechanism:
             *
             * Reading cookies works in Server Components because you're accessing the cookie data that the
             * client's browser sends to the server in the HTTP request headers.
             *
             * Setting cookies cannot be done directly in a Server Component, even when using a Route Handler
             * or Server Action. This is because cookies are actually stored by the browser, not the server.
             */
          }
        },
      },
    }
  );
}

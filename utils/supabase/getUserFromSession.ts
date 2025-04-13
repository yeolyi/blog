// https://gist.github.com/anarkrypto/9ee98bd23f25efd44a4cfb4ed256837a

/*
   A secure solution for user retrievement from session in server-side applications using Supabase.
      
   Instead of relying directly on the Supabase session object from cookie data like supabase.auth.getSession(),
   this tool mitigates the spoofing SSR attack vector by verifying the JWT token, ensuring the session's validity.
 
   Read more: https://github.com/orgs/supabase/discussions/23224
 
   - It uses jose instead of jsonwebtoken to remain compatible with edge runtime.
   - To use it, you need the JWT Secret of your Supabase, which should never be shared publicly.
   
   # Usage:
   	const safeSession = new SupabaseSafeSession(supabaseInstance, jwtSecret)
	const { data, error } = await safeSession.getUser()
	if (error) {
		throw new Error(error.message)
	}
	console.log("user data":, data)

   # Result:
	{
		"id": "12345678-90ab-cdef-1234-567890abcdef",
		"session_id": "fedcba98-7654-3210-fedc-ba9876543210",
		"role": "authenticated",
		"email": "john.doe@example.com",
		"phone": "",
		"app_metadata": { "provider": "email", "providers": ["email"] },
		"user_metadata": {
			"email": "john.doe@example.com",
			"email_verified": false,
			"phone_verified": false,
			"sub": "12345678-90ab-cdef-1234-567890abcdef"
		}
	}
*/

import { createClient } from '@/utils/supabase/server';
import {
  AuthError,
  type SupabaseClient,
  type UserAppMetadata,
  type UserMetadata,
} from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

export type SupabaseSafeUser = {
  id: string;
  session_id: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  app_metadata: UserAppMetadata;
  user_metadata: UserMetadata;
};

export type SupabaseSafeUserResponse =
  | { data: SupabaseSafeUser; error: null }
  | { data: null; error: AuthError };

export class SupabaseSafeSession {
  private supabase: SupabaseClient;
  private jwtSecret: Uint8Array;

  // biome-ignore lint/suspicious/noExplicitAny: 밖에서 가져온 코드
  constructor(supabase: SupabaseClient<any, any, any>, jwtSecret: string) {
    this.supabase = supabase;
    this.jwtSecret = new TextEncoder().encode(jwtSecret);
  }

  private async getAccessToken() {
    // Let Supabase get the session tokens and automatically refresh them if needed
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      return { error };
    }
    if (!data.session) {
      return { error: new AuthError('No session data') };
    }

    return {
      access_token: data.session.access_token,
    };
  }

  private async parseAccessToken(
    accessToken: string,
  ): Promise<SupabaseSafeUserResponse> {
    try {
      const { payload } = await jwtVerify<SupabaseSafeUser>(
        accessToken,
        this.jwtSecret,
      );
      return {
        data: {
          id: payload.sub as string,
          session_id: payload.session_id,
          role: payload.role ?? null,
          email: payload.email ?? null,
          phone: payload.phone ?? null,
          app_metadata: payload.app_metadata,
          user_metadata: payload.user_metadata,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: new AuthError('JWT verification failed') };
    }
  }

  public async getUser(): Promise<SupabaseSafeUserResponse> {
    const token = await this.getAccessToken();

    if (token.error) {
      return { data: null, error: token.error };
    }

    const { data: userData, error } = await this.parseAccessToken(
      token.access_token,
    );

    if (error) {
      return { data: null, error };
    }

    return { data: userData, error: null };
  }
}

export const getUserFromSession = async (client?: SupabaseClient) => {
  const supabase = client ?? (await createClient());
  const safeSession = new SupabaseSafeSession(
    supabase,
    // biome-ignore lint/style/noNonNullAssertion: 없으면 터지는게 맞음
    process.env.JWT_SECRET!,
  );
  const { data, error } = await safeSession.getUser();
  return { data, error };
};

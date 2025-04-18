// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

export type AuthenticationErrors = "RefreshAccessTokenError";
declare module "next-auth" {
  interface Session extends DefaultSession {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    token_type?: string;
    error?: AuthenticationErrors;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    token_type?: string;
    error?: AuthenticationErrors;
  }
}

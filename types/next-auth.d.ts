import { DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";
import { JWT } from "next-auth/jwt";
export type User = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
};

type Image = {
  url: string;
  height: number;
  width: number;
};
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
    access_token: JWT["access_token"];
    expires: string;
    refresh_token: JWT["refresh_token"];
    error: JWT["error"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
    access_token: string;
    expires_at: string | number;
    refresh_token: string;
    error: JWT["error"];
  }
}

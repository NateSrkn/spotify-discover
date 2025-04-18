import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";
import { JWT } from "@auth/core/jwt";
import { AuthenticationErrors } from "../types/next-auth";

const scope = [
  "user-top-read",
  "user-library-read",
  "user-read-email",
  "user-read-playback-state",
  "user-follow-read",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-follow-modify",
].join(" ");

export const { handlers, signOut, signIn, auth } = NextAuth({
  providers: [
    Spotify({
      authorization: `https://accounts.spotify.com/authorize?scope=${scope}`,
    }),
  ],
  session: {
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          id: account.id,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: expires_at(account.expires_in),
        };
      }

      if (Date.now() < Number(token.expires_at)) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.access_token = token.access_token as string;
        session.error = token.error as AuthenticationErrors;
      }
      return session;
    },
  },
});

const client_id = process.env.AUTH_SPOTIFY_ID;

const AUTH_URL = "https://accounts.spotify.com/api/token";

const refreshAccessToken = async (token: JWT) => {
  try {
    const response = await fetch(AUTH_URL, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refresh_token as string,
        client_id,
        scope,
      }),
    });

    const refreshed: {
      access_token: string;
      expires_in: number;
      refresh_token?: string;
      scope: string;
      token_type: string;
    } = await response.json();

    if (!response.ok) {
      throw refreshed;
    }

    console.log("success", refreshed);

    return {
      ...token,
      access_token: refreshed.access_token,
      expires_at: expires_at(refreshed.expires_in),
      refresh_token: refreshed.refresh_token || token.refresh_token,
    };
  } catch (error) {
    console.error("Error Refreshing Access Token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

const expires_at = (expires_in: number = 60 * 60) => {
  return Date.now() + expires_in * 1000;
};

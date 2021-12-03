import Spotify from "next-auth/providers/spotify";
import NextAuth from "next-auth";
import { refreshToken } from "../../../util/spotify";

export default NextAuth({
  providers: [
    Spotify({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      scope: [
        "user-top-read",
        "user-read-recently-played",
        "user-read-currently-playing",
        "user-read-playback-state",
        "user-read-email",
      ].join(","),
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + <number>account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await refreshToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.expires = new Date(token.accessTokenExpires).toDateString();
        session.accessToken = token.accessToken;
        session.error = token.error;
      }

      return session;
    },
  },
});

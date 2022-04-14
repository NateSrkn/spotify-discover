import Spotify from "next-auth/providers/spotify";
import NextAuth from "next-auth";
import { refreshToken } from "../../../util/spotify";

const scope = [
  "user-top-read",
  "user-read-recently-played",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-email",
  "user-read-private",
].join(",");
export default NextAuth({
  providers: [
    Spotify({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: `https://accounts.spotify.com/authorize?scope=${scope}`,
      userinfo: "https://api.spotify.com/v1/me",
      profile: (profile) => ({
        name: profile.display_name,
        id: profile.id,
        email: profile.email,
        image: profile.images[0].url,
        profile: profile.external_urls.spotify,
        country: profile.country,
      }),
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          access_token: account.access_token,
          expires_at: Date.now() + <number>account.expires_in * 1000,
          refresh_token: account.refresh_token,
          user,
        };
      }

      const isTokenExpired = token.expires_at < Date.now();
      if (isTokenExpired) {
        return await refreshToken(token);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.expires = new Date(token.expires_at).toDateString();
        session.access_token = token.access_token;
        session.error = token.error;
      }
      return session;
    },
  },
});

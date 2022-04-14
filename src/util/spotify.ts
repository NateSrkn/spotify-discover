const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const redirect_uri =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_REDIRECT_URI
    : process.env.NEXT_PUBLIC_REDIRECT_URI;
const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

export async function refreshToken(token) {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
        redirect_uri,
      }),
    });
    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      expires_at: Date.now() + refreshedTokens.expires_in * 1000,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "Refreshaccess_tokenError",
    };
  }
}

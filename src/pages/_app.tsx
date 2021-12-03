import { useState } from "react";
import { AppProps } from "next/dist/shared/lib/router/router";
import { QueryClientProvider, QueryClient, Hydrate } from "react-query";
import { ThemeProvider } from "next-themes";
import "../styles/globals.scss";
import { AudioTracker } from "../providers";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = useState(new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={session}>
          <AudioTracker>
            <ThemeProvider attribute="class">
              <Component {...pageProps} />
            </ThemeProvider>
          </AudioTracker>
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;

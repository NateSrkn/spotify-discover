import { useState } from "react";
import { AppProps } from "next/dist/shared/lib/router/router";
import { QueryClientProvider, QueryClient, Hydrate } from "react-query";
import { ThemeProvider } from "next-themes";
import "../styles/globals.scss";
import { AudioTracker } from "../providers";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AudioTracker>
          <ThemeProvider attribute="class">
            <Component {...pageProps} />
          </ThemeProvider>
        </AudioTracker>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;

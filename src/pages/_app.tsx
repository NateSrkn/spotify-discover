import { useState } from "react";
import { AppProps } from "next/dist/shared/lib/router/router";
import { QueryClientProvider, QueryClient, Hydrate } from "react-query";
import { ThemeProvider } from "next-themes";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;

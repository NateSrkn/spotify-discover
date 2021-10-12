import { AppProps } from "next/dist/shared/lib/router/router";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "next-themes";
import "../styles/globals.scss";
import Layout from "../components/Layout";
import { MouseTracker } from "../components/MouseTracker";

export const queryClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <MouseTracker>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MouseTracker>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;

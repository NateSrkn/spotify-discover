import React, { ReactElement, ReactNode } from "react";
import { AppProps } from "next/dist/shared/lib/router/router";
import "../styles/globals.scss";
import { AudioTracker } from "../providers";
import { SessionProvider } from "next-auth/react";
import { NextPage } from "next";

export type NextPageWithLayout<T = {}> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={session}>
      <AudioTracker>{getLayout(<Component {...pageProps} />)}</AudioTracker>
    </SessionProvider>
  );
}

export default MyApp;

import Head from "next/head";
import { Fragment } from "react";
import { Footer, Header } from ".";
import Controls from "./Controls";
import { NowPlaying } from "./NowPlaying";

export const Layout = ({ children, session = null, ...customMeta }) => {
  const meta = {
    title: "Crumbs",
    description:
      "Crumbs is a simple, and fast way for you to discover music based on what you already like.",
    type: "website",
    ...customMeta,
  };
  return (
    <Fragment>
      <div className="border-b primary-border sm:mb-4 sticky-header shadow">
        <Header />
      </div>

      <div className="flex flex-col justify-center items-start px-4 py-4 w-full max-w-7xl mx-auto min-h-full">
        <Head>
          <title>{meta.title}</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content={meta.description} />
          <meta property="og:title" content={meta.title} />
          <meta name="og:type" content={meta.type} />
          <meta name="twitter:site" content="@n8bytes" />
          <meta name="twitter:title" content={meta.title} />
          <meta name="twitter:description" content={meta.description} />
        </Head>
        <main className="flex-1 w-full min-h-screen">
          <div className="pb-4 block sm:hidden">
            <NowPlaying />
          </div>
          {children}
        </main>
        <div className="fixed left-0 bottom-0 w-full">
          <div className="flex items-center m-3 md:max-w-sm rounded shadow-2xl gap-2 animate-fade-in">
            <Controls />
          </div>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
};

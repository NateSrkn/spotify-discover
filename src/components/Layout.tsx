import Head from "next/head";
import { Footer, Header } from ".";

export const Layout = ({ children, session = null, ...customMeta }) => {
  const meta = {
    title: "Crumbs",
    description:
      "Crumbs is a simple, and fast way for you discover music based on what you already like.",
    type: "website",
    ...customMeta,
  };
  return (
    <div className="flex flex-col justify-center items-start px-4 w-full max-w-6xl mx-auto min-h-full">
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
      <Header session={session} />
      <main className="flex-1 w-full min-h-screen">{children}</main>
      <Footer />
    </div>
  );
};

import { Html, Head, Main, NextScript } from "next/document";

export default function Document(props) {
  return (
    <Html lang="en">
      <Head></Head>
      <body className="bg-white dark:bg-dark text-black dark:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

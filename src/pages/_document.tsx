import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap"
            rel="stylesheet"
          />
          <link href="https://api.fontshare.com/css?f[]=satoshi@1&display=swap" rel="stylesheet" />
        </Head>
        <body className="bg-dark text-white transition">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

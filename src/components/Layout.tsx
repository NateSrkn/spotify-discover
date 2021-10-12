import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col justify-center px-4 w-full max-w-6xl mx-auto">
      {/* <Header /> */}

      {children}
      <Footer />
    </div>
  );
}

import { Link } from "./Link";

export const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center w-full mt-4 mb-8">
      <hr className="w-full border-1 border-secondary-green mb-8" />
      <div className="w-full max-w-2xl grid grid-cols-1 gap-4 pb-16 sm:grid-cols-2">
        <div className="flex flex-col space-y-4">
          <Link href="/" className="base-link">
            Home
          </Link>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="https://github.com/natesrkn" className="base-link">
            GitHub
          </Link>
          <Link href="https://open.spotify.com/user/natesrkn" className="base-link">
            Spotify
          </Link>
        </div>
      </div>
    </footer>
  );
};

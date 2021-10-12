import Link from "next/link";
const ExternalLink = ({ href, children }) => (
  <a
    className="base-link"
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {children}
  </a>
);

export const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center w-full mt-4 mb-8">
      <hr className="w-full border-1 border-green-custom mb-8" />
      <div className="w-full max-w-2xl grid grid-cols-1 gap-4 pb-16 sm:grid-cols-2">
        <div className="flex flex-col space-y-4">
          <Link href="/">
            <a className="base-link">Home</a>
          </Link>
        </div>
        <div className="flex flex-col space-y-4">
          <ExternalLink href="https://github.com/natesrkn">GitHub</ExternalLink>
          <ExternalLink href="https://open.spotify.com/user/natesrkn">
            Spotify
          </ExternalLink>
        </div>
      </div>
    </footer>
  );
};

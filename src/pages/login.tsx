import { signIn, getSession } from "next-auth/client";
export default function LoginPage() {
  return (
    <div className="h-screen flex justify-center flex-col gap-2">
      <h4 className="text-2xl font-bold">Welcome to Spotify Discovery</h4>
      <div className="text-lg font-medium">
        Very much so a work in progress, proceed with caution.
      </div>
      <a
        onClick={() => signIn("spotify")}
        className="hover:underline inline-flex w-max cursor-pointer"
      >
        Sign in
      </a>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

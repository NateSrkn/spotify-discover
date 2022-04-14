import { signIn, getSession } from "next-auth/react";
import { Button, Layout } from "../components";
export default function Home() {
  return (
    <Layout>
      <div className="h-screen flex justify-center flex-col gap-2">
        <h4 className="text-2xl font-bold">Welcome to Crumbs</h4>
        <div className="text-lg font-medium">
          <p className="mb-4">
            Crumbs is a simple, and fast way for you to discover music based on what you already
            like.
          </p>
        </div>
        <Button action={() => signIn("spotify")}>Sign in</Button>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (session) {
    return {
      props: {
        session,
      },
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}

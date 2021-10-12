import { signIn, getSession } from "next-auth/client";
import { Button, Layout } from "../components";
export default function LoginPage() {
  return (
    <Layout>
      <div className="h-screen flex justify-center flex-col gap-2">
        <h4 className="text-2xl font-bold">Welcome to Crumbs</h4>
        <div className="text-lg font-medium">
          <p className="mb-4">
            Crumbs is a simple, and fast way for you to discover music based on
            what you already like.
          </p>
        </div>
        <Button onClick={() => signIn("spotify")}>Sign in</Button>
      </div>
    </Layout>
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

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginButton } from "@/components/auth/LoginButton";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <main className="container px-3 flex justify-center items-center w-full h-screen">
      <section
        className={
          "max-w-[480px] items-center sm:items-start rounded-2xl flex flex-col  gap-4"
        }
      >
        <div className="flex gap-2 flex-col text-center sm:text-left">
          <h1 className="text-4xl font-bold">Crumbs</h1>
          <p className="text-pewter-blue font-medium">
            Crumbs is a simple, and fast way for you to discover music based on
            what you already like.
          </p>
        </div>
        <LoginButton className="px-4 py-2 rounded-lg bg-primary-green hover:bg-secondary-green cursor-pointer font-medium hover:scale-105 transition-all">
          Continue with Spotify
        </LoginButton>
      </section>
    </main>
  );
}

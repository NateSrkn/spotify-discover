import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
export default async function User() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <LogoutButton>
      <div className="flex gap-4 items-center justify-center">
        <img
          src={session.user.image}
          alt={session.user.name}
          className="rounded-full size-8 aspect-square object-cover"
        />
        <span className="text-white">{session.user.name}</span>
      </div>
    </LogoutButton>
  );
}

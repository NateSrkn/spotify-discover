import { signOut } from "@/auth";

export function LogoutButton({ children }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">{children}</button>
    </form>
  );
}

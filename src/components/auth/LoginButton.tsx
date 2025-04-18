import { signIn } from "@/auth";
import type { ComponentProps, PropsWithChildren } from "react";

type LoginButtonProps = PropsWithChildren<ComponentProps<"button">>;
export function LoginButton({ children, ...rest }: LoginButtonProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("spotify");
      }}
    >
      <button type="submit" {...rest}>
        {children}
      </button>
    </form>
  );
}

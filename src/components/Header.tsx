import { Image, Button, DarkModeToggle, NowPlaying } from ".";
import { signOut, useSession } from "next-auth/react";
import React from "react";

export const Header = () => {
  const { status, data: session } = useSession();
  return (
    <header className="flex flex-col py-4 w-full">
      {status === "authenticated" ? (
        <React.Fragment>
          <div className="flex items-start justify-between">
            <div className="flex gap-4 items-center">
              <div className="overflow-hidden h-16 w-16 rounded-full">
                <Image src={session.user?.image} alt={session.user.name} width={100} height={100} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">{session.user.name}</h3>
                <Button onClick={() => signOut()}>Sign Out</Button>
              </div>
            </div>
            <DarkModeToggle />
          </div>
          <div className="my-2">
            <NowPlaying />
          </div>
        </React.Fragment>
      ) : (
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold">Crumbs</h3>
          <DarkModeToggle />
        </div>
      )}
    </header>
  );
};

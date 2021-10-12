import { Image, Button, DarkModeToggle, NowPlaying } from ".";
import { signOut } from "next-auth/client";
import React from "react";

export const Header = ({ session }) => {
  return (
    <header className="flex flex-col my-4 w-full">
      {session ? (
        <React.Fragment>
          <div className="flex items-start justify-between">
            <div className="flex gap-4 items-center">
              <div className="overflow-hidden h-16 w-16 rounded-full">
                <Image
                  src={session.user?.image}
                  alt={session.user.name}
                  width={100}
                  height={100}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">{session.user.name}</h3>
                <Button onClick={() => signOut()}>
                  <span className="text-xs">Sign Out</span>
                </Button>
              </div>
            </div>
            <DarkModeToggle />
          </div>
          <div className="my-4">
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

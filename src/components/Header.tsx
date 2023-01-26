import { Image, NowPlaying } from ".";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Link } from "./Link";

import { Item, Dropdown, Trigger, Content } from "./Dropdown";

export const Header = () => {
  const { status, data: session } = useSession();
  return (
    <header className="flex flex-col p-4 w-full max-w-7xl mx-auto">
      {status === "authenticated" ? (
        <React.Fragment>
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <h3 className="text-xl font-bold">Crumbs</h3>
            </Link>
            <div className="flex gap-4 items-center">
              <div className="hidden sm:block">
                <NowPlaying />
              </div>
              <Dropdown>
                <Trigger className="img-wrap sm-img full-round">
                  <Image
                    src={session.user?.image}
                    alt={session.user.name}
                    width={100}
                    height={100}
                  />
                </Trigger>
                <Content>
                  <Item onClick={() => signOut()}>Sign Out</Item>
                </Content>
              </Dropdown>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold">Crumbs</h3>
        </div>
      )}
    </header>
  );
};

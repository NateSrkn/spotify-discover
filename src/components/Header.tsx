import { Image, ThemeToggle, NowPlaying } from ".";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Link } from "./Link";
import { useTheme } from "next-themes";
import { FiCheck } from "react-icons/fi";
import { Checkbox, Item, Label, Separator, Dropdown, Trigger, Content } from "./Dropdown";
import { ItemIndicator } from "@radix-ui/react-dropdown-menu";
export const Header = () => {
  const { status, data: session } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
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
                <Trigger className="overflow-hidden sm-img rounded-full">
                  <Image
                    src={session.user?.image}
                    alt={session.user.name}
                    width={100}
                    height={100}
                  />
                </Trigger>
                <Content>
                  {/* <Label className="px-4 py-1 font-medium">{session.user.name}</Label> */}
                  {/* <Separator /> */}
                  {/* <Label>Theme</Label> */}
                  <Checkbox
                    onCheckedChange={() => setTheme("light")}
                    checked={resolvedTheme === "light"}
                  >
                    Light
                    <ItemIndicator>
                      <FiCheck />
                    </ItemIndicator>
                  </Checkbox>
                  <Checkbox
                    onCheckedChange={() => setTheme("dark")}
                    checked={resolvedTheme === "dark"}
                  >
                    Dark
                    <ItemIndicator>
                      <FiCheck />
                    </ItemIndicator>
                  </Checkbox>
                  <Separator />
                  <Item onClick={() => signOut()}>Sign Out</Item>
                </Content>
              </Dropdown>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold">Crumbs</h3>
          <ThemeToggle />
        </div>
      )}
    </header>
  );
};

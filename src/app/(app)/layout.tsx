import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { PreviewProvider } from "@/providers/PreviewProvider";
import User from "@/components/User";
import Link from "next/link";
import { Playlist } from "@/components/Playlist";
import { TrackPreview } from "@/components/TrackPreview";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return (
    <Fragment>
      <PreviewProvider>
        <TooltipProvider>
          <header className="container mx-auto p-4 flex items-center w-full justify-between">
            <Link href={"/dashboard"} className="font-bold text-xl">
              Crumbs
            </Link>
            <div className="flex items-center justify-end gap-2">
              {/*<Playlist />*/}
              <User />
            </div>
          </header>
          <hr className="border-secondary-green" />
          <main className="container mx-auto p-4 mb-24">{children}</main>
          <TrackPreview />
        </TooltipProvider>
      </PreviewProvider>
    </Fragment>
  );
}

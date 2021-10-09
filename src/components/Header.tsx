import Image from "next/image";
import { options as optionsAtom } from "../util/store";
import { useAtom } from "jotai";
import { getSession, signOut } from "next-auth/client";
import { Session } from "next-auth";

export default function Header() {
  const [options, setOptions] = useAtom(optionsAtom);
  const types = {
    tracks: "Tracks",
    artists: "Artists",
  };

  const titles = {
    long_term: "All Time",
    medium_term: "Last 6 Months",
    short_term: "Last Month",
  };

  const handleSetOptions = (name: keyof typeof options, value: string) => {
    if (options[name] === value) return;
    setOptions({ ...options, [name]: value });
  };

  return (
    <header>
      <div>
        {titles[options.termLength]} / {types[options.type]}
      </div>
      {Object.entries(types).map(([key, value]) => (
        <button
          onClick={() => handleSetOptions("type", key)}
          key={key}
          className="font-normal dark:text-pewter-blue hidden md:inline-block p-1 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-green-custom transition-all"
        >
          {value}
        </button>
      ))}
      {Object.entries(titles).map(([key, value]) => (
        <button
          onClick={() => handleSetOptions("termLength", key)}
          key={key}
          className="font-normal dark:text-pewter-blue hidden md:inline-block p-1 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-green-custom  transition-all"
        >
          {value}
        </button>
      ))}
    </header>
  );
}

"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import tickTask from "@/assets/ticktask.svg";
import tickTaskLight from "@/assets/ticktasklight.svg";
import { useBoardStore } from "@/store/BoardStore";
import ThemeMode from "./ThemeMode";
import { useTheme } from "next-themes";
function Header() {
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);

  const { resolvedTheme } = useTheme();

  const [logoSrc, setLogoSrc] = useState(tickTask);

  useEffect(() => {
    setLogoSrc(resolvedTheme === "dark" ? tickTaskLight : tickTask);
  }, [resolvedTheme]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div className="rounded-md filter blur-3xl opacity-50 -z-50 absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1]" />

        <Image
          alt="tickTask Logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
          src={logoSrc}
          priority
        />
        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          <form className="md:flex-initial flex items-center bg-white dark:bg-white/20 space-x-5 rounded-md p-2 shadow-inner flex-1">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 dark:text-gray-200" />
            <input
              type="text"
              placeholder="Search..."
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="p-2 dark:placeholder:text-gray-200  bg-transparent outline-none flex-1"
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
          <ThemeMode />
          <Avatar name="Mark Vayson" round color="#0055D1" size="50" />
        </div>
      </div>
    </header>
  );
}

export default Header;

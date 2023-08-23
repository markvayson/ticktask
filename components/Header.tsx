"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import tickTask from "@/assets/ticktask.svg";
import { useBoardStore } from "@/store/BoardStore";
function Header() {
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div className="rounded-md filter blur-3xl opacity-50 -z-50 absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1]" />
        <Image
          alt="tickTask Logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
          src={tickTask}
          priority
        />
        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          <form className="md:flex-initial flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="p-2 outline-none flex-1"
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
          <Avatar name="Mark Vayson" round color="#0055D1" size="50" />
        </div>
      </div>
    </header>
  );
}

export default Header;

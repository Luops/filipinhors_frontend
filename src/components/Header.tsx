"use client";

import React from "react";

// Next
import Link from "next/link";

type Props = {};

// Shadcn UI
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";

// Lucide Icons
import { Facebook, Twitter, Youtube, Mail, Search } from "lucide-react";

function Header({}: Props) {
  return (
    <header className="w-full overflow-auto fixed top-0 flex z-50 items-center justify-between bg-[#fbfbfb] shadow-[0px_2px_9px_3px_#1b191929] rounded-[5px]">
      <article className="w-[80%] flex flex-col items-center justify-center py-3">
        <h2 className=" text-3xl text-black uppercase font-black tracking-widest drop-shadow-lg">
          Filipinhors
        </h2>
        <div className="flex items-center gap-2">
          <i className="hover:text-[#3b5998] transition-all ease-in-out duration-300">
            <Link href="https://www.facebook.com/filipinhors/" target="_blank">
              <Facebook />
            </Link>
          </i>
          <i className="hover:text-[#00acee] transition-all ease-in-out duration-300">
            <Link href="https://www.facebook.com/filipinhors/" target="_blank">
              <Twitter />
            </Link>
          </i>
          <i className="hover:text-red-500 transition-all ease-in-out duration-300">
            <Link href="https://www.facebook.com/filipinhors/" target="_blank">
              <Youtube />
            </Link>
          </i>
          <i className="hover:text-[#7d7d7d] transition-all ease-in-out duration-300">
            <Link href="https://www.facebook.com/filipinhors/" target="_blank">
              <Mail />
            </Link>
          </i>
        </div>
      </article>
      <ul className="w-full flex items-center justify-center text-black drop-shadow-lg tracking-widest py-3">
        <li className="px-4">
          <Link
            href="/"
            className="hover:border-b-4 font-bold hover:border-black transition-all ease-in-out"
          >
            Home
          </Link>{" "}
        </li>
        <li className="px-4">
          <Link
            href="/Economia"
            className="hover:border-b-4 font-bold hover:border-black transition-all ease-in-out"
          >
            Economia
          </Link>{" "}
        </li>
        <li className="px-4">
          <Link
            href="/Campanha"
            className="hover:border-b-4 font-bold hover:border-black transition-all ease-in-out"
          >
            Campanha
          </Link>{" "}
        </li>
        <li className="px-4">
          <Link
            href="/Empregos"
            className="hover:border-b-4 font-bold hover:border-black transition-all ease-in-out"
          >
            Empregos
          </Link>{" "}
        </li>
        <li className="px-4">
          <Link
            href="/Dashboard"
            className="hover:border-b-4 font-bold hover:border-black transition-all ease-in-out"
          >
            Dashboard
          </Link>{" "}
        </li>
      </ul>
      <form action="" className="">
        <Label
          htmlFor="search"
          className="flex items-center justify-center mr-5"
        >
          <input
            type="text"
            placeholder="Pesquisar"
            className="w-[180px] h-[30px] border-none outline-none px-1 focus:outline-[#818181] rounded-[5px_0px_0px_5px] bg-[#fbfbfb] text-black"
          />
          <Button className="h-[35px]">
            <Search className="h-5" />
          </Button>
        </Label>
      </form>
    </header>
  );
}

export default Header;

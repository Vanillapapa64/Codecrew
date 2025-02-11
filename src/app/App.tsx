"use client";
import { signIn, signOut } from "next-auth/react";
import Example from "./components/Dropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Signinbutton from "./components/signinbutton"
export const Appbar = () => {
  const pathname = usePathname();
  const excludedPaths = ["/signin", "/signup","/"];
  const overallExcluded = ["/dashboard"];
  const mainpath=["/"]
  if (overallExcluded.includes(pathname)) {
    return <div></div>;
  }

  return (
    <div className="h-28 bg-black grid grid-cols-2 lg:grid-cols-3 items-center w-screen px-5">
      {/* Empty div only for lg screens */}
      <div className="hidden lg:block"></div>

      {/* Centered Logo */}
      <Link
        href="/projects"
        className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 justify-self-center col-span-1"
      >
        CODECREW
      </Link>

      {/* Dropdown aligned right */}
      <div className="justify-self-end">
        {!excludedPaths.includes(pathname) && <Example />}
        {mainpath.includes(pathname) && < Signinbutton/>}
      </div>
    </div>
  );
};

"use client";
import { signIn, signOut } from "next-auth/react"
import Example from "./components/Dropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Appbar = () => {
  const pathname=usePathname()
  const excludedpaths=["/signin","/signup"]
  const overallexcluded=["/dashboard"]
  if (overallexcluded.includes(pathname)){
    return<div></div>
  }
  return (
    <div className="h-28 bg-black grid grid-cols-2 lg:grid-cols-3 items-center w-screen">
      <div className="hidden lg:block"></div>
      <Link href="/" className="text-3xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 justify-self-center">
        CODECREW
      </Link>
      <div className="justify-self-end pr-10">
      {!excludedpaths.includes(pathname) && <Example />}
      </div>
    </div>
  );
};

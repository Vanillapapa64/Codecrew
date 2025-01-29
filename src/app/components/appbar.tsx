"use client";
import { signIn, signOut } from "next-auth/react"

export const Appbars = () => {
  return(
  <div className="h-28 bg-black flex justify-center items-center w-screen">

  <div  className="text-3xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 justify-self-center">
    CODECREW
  </div>

</div>)
} 
import React from "react";
import { Button } from "../components/button";

export default function Dashboard() {
  return (
    <div className="h-screen w-full dark:bg-black bg-fuchsia-950  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center flex-col">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="flex-grow flex items-center justify-center flex-col">
        <p className="text-6xl sm:text-7xl lg:text-8xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 py-8">
          Code-Crew
        </p>
        <Button />
      </div>
        <footer className="w-full py-4 text-center text-neutral-400 relative z-20 ">
        Made with love by <a className="text-green-500 font-semibold" href="https://www.linkedin.com/in/navkirat-singh-a70220275?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank">Navkirat Singh</a>
      </footer>
    </div>
  );
}


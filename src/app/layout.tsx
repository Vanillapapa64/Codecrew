
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; 

import { Providers } from "./components/providers";
import { Appbar } from "./App";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeCrew: An innovative Coding collaboration platform",
  description: "Create/View/Collaborate in Project that matches your Techstack. Find fellow Nerds",
  keywords: ["Coding", "Programming", "Teammates", "Projects"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><link rel="shortcut icon" href="/favicon.ico" /></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        
        <Providers>
        <Appbar />
        {children}
        </Providers>
      </body>
    </html>
  );
}

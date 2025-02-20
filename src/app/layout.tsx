
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; 

import { Providers } from "./components/providers";
import { Appbar } from "./App";
import {FadeInWrapper} from "./components/fadeinwrapper";
import { AppFadeInWrapper } from "./components/Appbarfadein";



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
}>){
  console.log(FadeInWrapper)
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="twitter:image" content="https://codecrew.navkirat.in/ogimage.png" />
        <meta name="twitter:title" content="CodeCrew: An innovative Coding collaboration platform"/>
        <meta name="twitter:description" content="Create/View/Collaborate in Project that matches your Techstack. Find fellow Nerds"/>
        <meta name="og:title" content="CodeCrew: An innovative Coding collaboration platform"/>
        <meta name="og:description" content="Create/View/Collaborate in Project that matches your Techstack. Find fellow Nerds"/>
        <meta name="og:image" content="/ogimage.png"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta property="og:image:secure_url" content="https://codecrew.navkirat.in/ogimage.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AppFadeInWrapper>
          <Appbar />
          </AppFadeInWrapper>
        
        <FadeInWrapper>
          {children}
          </FadeInWrapper>
        </Providers>
        
      </body>
    </html>
  );
}


"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CharCreator from "../char-creator";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-900 font-sans relative overflow-hidden">
      {/* BACKGROUND DEPTH */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-zinc-50 to-zinc-100" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.06),transparent_60%)]" />

      <main className="relative flex flex-col items-center justify-center gap-8 px-6 py-16">
        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black tracking-[-0.02em] text-center leading-none
          bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-400 
          bg-clip-text text-transparent"
        >
          GACHA WORLD
        </motion.h1>

        {/* ALBUM ART */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mt-2"
        >
          {/* RADIAL LIGHT BEHIND IMAGE */}
          <div className="absolute -inset-16 bg-[radial-gradient(circle,rgba(0,0,0,0.08),transparent_70%)] blur-2xl" />

          {/* SOFT GLOW EDGE */}
          <div className="absolute -inset-6 blur-2xl opacity-20 bg-gradient-to-tr from-zinc-200 via-white to-zinc-300 rounded-2xl" />

          <Image
            src="/gw-art.jpg"
            alt="Gacha World Art"
            width={340}
            height={340}
            className="relative rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.18)]"
            priority
          />
        </motion.div>

        {/* SOCIALS */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-7 mt-4"
        >
          {[
            {
              src: "/spotify-fill-svgrepo-com.svg",
              href: "#",
              size: 30,
              tweak: "-translate-y-[2px]",
            },
            { src: "/apple-music-svgrepo-com.svg", href: "#", size: 26 },
            { src: "/instagram-fill-svgrepo-com.svg", href: "#", size: 28 },
            { src: "/youtube-fill-svgrepo-com.svg", href: "#", size: 28 },
            { src: "/tiktok-fill-svgrepo-com.svg", href: "#", size: 28 },
          ].map((icon, i) => (
            <a key={i} href={icon.href} target="_blank">
              <Image
                src={icon.src}
                alt="social"
                width={icon.size}
                height={icon.size}
                className={`
                  opacity-60 hover:opacity-100 
                  hover:scale-110 
                  transition duration-200 ease-out
                  ${icon.tweak || ""}
                `}
              />
            </a>
          ))}
        </motion.div>
        <CharCreator />
      </main>
    </div>
  );
}

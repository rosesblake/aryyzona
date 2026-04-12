"use client";

import { useEffect, useRef, useState } from "react";

export default function CharCreator() {
  const [hairIndex, setHairIndex] = useState(0);
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [wingsEnabled, setWingsEnabled] = useState(false);
  const [isAssetsReady, setIsAssetsReady] = useState(false);

  const totalHair = 5;
  const totalOutfits = 5;
  const totalBackgrounds = 6; // 5 real backgrounds + 1 transparent option

  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  const next = (setter: any, total: number) =>
    setter((prev: number) => (prev + 1) % total);

  const prev = (setter: any, total: number) =>
    setter((prev: number) => (prev - 1 + total) % total);

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const cached = imageCache.current.get(src);
      if (cached) {
        resolve(cached);
        return;
      }

      const img = new Image();
      img.decoding = "async";
      img.src = src;

      img.onload = () => {
        imageCache.current.set(src, img);
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load ${src}`));
      };
    });

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        const sources: string[] = [
          "/avatar/body.png",
          "/avatar/wings.png",
          ...Array.from(
            { length: totalHair },
            (_, i) => `/avatar/hair-${i}.png`,
          ),
          ...Array.from(
            { length: totalOutfits },
            (_, i) => `/avatar/outfit-${i}.png`,
          ),
          ...Array.from(
            { length: totalBackgrounds - 1 },
            (_, i) => `/avatar/base-${i}.png`,
          ),
        ];

        await Promise.all(sources.map(loadImage));
        setIsAssetsReady(true);
      } catch (err) {
        console.error("Failed to preload avatar assets:", err);
      }
    };

    preloadAssets();
  }, []);

  const getCachedImage = async (src: string) => {
    const cached = imageCache.current.get(src);
    if (cached) return cached;
    return await loadImage(src);
  };

  const downloadImage = async () => {
    const width = 300;
    const height = 380;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const drawContain = (img: HTMLImageElement) => {
      const scale = Math.min(width / img.width, height / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const x = (width - drawW) / 2;
      const y = (height - drawH) / 2;

      ctx.drawImage(img, x, y, drawW, drawH);
    };

    const drawCover = (img: HTMLImageElement) => {
      const scale = Math.max(width / img.width, height / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const x = (width - drawW) / 2;
      const y = (height - drawH) / 2;

      ctx.drawImage(img, x, y, drawW, drawH);
    };

    const base =
      backgroundIndex !== totalBackgrounds - 1
        ? await getCachedImage(`/avatar/base-${backgroundIndex}.png`)
        : null;

    const body = await getCachedImage("/avatar/body.png");
    const outfit = await getCachedImage(`/avatar/outfit-${outfitIndex}.png`);
    const hair = await getCachedImage(`/avatar/hair-${hairIndex}.png`);
    const wings = wingsEnabled
      ? await getCachedImage("/avatar/wings.png")
      : null;

    ctx.clearRect(0, 0, width, height);

    if (base) drawCover(base);
    if (wings) drawContain(wings);
    drawContain(body);
    drawContain(outfit);
    drawContain(hair);

    const link = document.createElement("a");
    link.download = "gacha-avatar.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="mt-2 flex flex-col items-center gap-8 px-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-800">
          Customize Your Pixelaryy
        </h2>
        <p className="text-sm text-zinc-500">
          {isAssetsReady
            ? "Build your look, then download your character"
            : "Loading avatar assets..."}
        </p>
      </div>

      <div className="w-full max-w-[980px] rounded-[36px] border border-zinc-200/80 bg-white/90 shadow-[0_30px_100px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-[1.02fr_0.98fr]">
          <div className="flex items-center justify-center border-b border-zinc-200/80 p-8 md:border-b-0 md:border-r">
            <div className="relative">
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-white to-zinc-100 shadow-[0_20px_60px_rgba(0,0,0,0.12)]" />
              <div className="relative flex h-[380px] w-[300px] items-center justify-center overflow-hidden rounded-[28px]">
                {backgroundIndex !== totalBackgrounds - 1 && (
                  <img
                    src={`/avatar/base-${backgroundIndex}.png`}
                    className="absolute inset-0 h-full w-full object-cover"
                    alt=""
                    draggable={false}
                  />
                )}

                {wingsEnabled && (
                  <img
                    src="/avatar/wings.png"
                    className="absolute inset-0 h-full w-full object-contain"
                    alt=""
                    draggable={false}
                  />
                )}

                <img
                  src="/avatar/body.png"
                  className="absolute inset-0 h-full w-full object-contain"
                  alt=""
                  draggable={false}
                />
                <img
                  src={`/avatar/outfit-${outfitIndex}.png`}
                  className="absolute inset-0 h-full w-full object-contain"
                  alt=""
                  draggable={false}
                />
                <img
                  src={`/avatar/hair-${hairIndex}.png`}
                  className="absolute inset-0 h-full w-full object-contain"
                  alt=""
                  draggable={false}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-[360px]">
              <div className="space-y-4">
                <div className="border-b border-zinc-200 pb-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                    Creator Controls
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                      Background
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-700">
                      {backgroundIndex === totalBackgrounds - 1
                        ? "None"
                        : `${backgroundIndex + 1} / ${totalBackgrounds - 1}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => prev(setBackgroundIndex, totalBackgrounds)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 active:scale-95"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => next(setBackgroundIndex, totalBackgrounds)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 active:scale-95"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                      Hair
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-700">
                      {hairIndex + 1} / {totalHair}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => prev(setHairIndex, totalHair)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 active:scale-95"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => next(setHairIndex, totalHair)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 active:scale-95"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                      Outfit
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-700">
                      {outfitIndex + 1} / {totalOutfits}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => prev(setOutfitIndex, totalOutfits)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 active:scale-95"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => next(setOutfitIndex, totalOutfits)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 active:scale-95"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                      Wings
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-700">
                      {wingsEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>

                  <button
                    onClick={() => setWingsEnabled((prev) => !prev)}
                    className={`relative flex h-10 w-[88px] items-center rounded-full px-1 transition ${
                      wingsEnabled ? "bg-zinc-900" : "bg-zinc-200"
                    }`}
                  >
                    <span
                      className={`absolute h-8 w-10 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        wingsEnabled ? "translate-x-[44px]" : "translate-x-0"
                      }`}
                    />
                    <span className="relative z-10 flex w-1/2 justify-center text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                      Off
                    </span>
                    <span
                      className={`relative z-10 flex w-1/2 justify-center text-[11px] font-medium uppercase tracking-wide ${
                        wingsEnabled ? "text-zinc-900" : "text-zinc-500"
                      }`}
                    >
                      On
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-6 border-t border-zinc-200 pt-6">
                <button
                  onClick={downloadImage}
                  disabled={!isAssetsReady}
                  className="h-12 w-full rounded-full bg-zinc-900 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Download Character
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

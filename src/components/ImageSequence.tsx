"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useWindowSize } from "react-use";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageSequenceProps {
  baseUrl?: string;
  mobileBaseUrl?: string;
  onImageChange?: (index: number) => void;
}

export function ImageSequence({
  baseUrl = "/webp/",
  mobileBaseUrl = "/mobileWebp/",
  onImageChange,
}: ImageSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 450;

  // Frame configuration
  const frameConfig = {
    desktop: { count: 253, base: baseUrl },
    mobile: { count: 254, base: mobileBaseUrl },
  };

  const { count: totalFrames, base: imageUrlBase } = isMobile
    ? frameConfig.mobile
    : frameConfig.desktop;

  // Preload management
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const imageUrls = useMemo(
    () =>
      Array.from(
        { length: totalFrames },
        (_, i) => `${imageUrlBase}${i.toString().padStart(3, "0")}.webp`
      ),
    [imageUrlBase, totalFrames]
  );

  const preloadImages = useCallback(async () => {
    const loadImage = (url: string) =>
      new Promise<void>((resolve) => {
        const img = document.createElement("img"); // Fixed Image constructor
        img.src = url;
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(url));
          resolve();
        };
        img.onerror = () => resolve();
      });

    // Initial critical load
    await Promise.all(imageUrls.slice(0, 20).map(loadImage));

    // Progressive background loading
    imageUrls.slice(20).forEach((url, i) => {
      setTimeout(() => loadImage(url), i * 20);
    });

    setIsLoading(false);
  }, [imageUrls]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(
      Math.round(latest * (totalFrames - 1)),
      totalFrames - 1
    );
    const newUrl = imageUrls[index];

    if (newUrl && newUrl !== currentImageUrl) {
      // Preload adjacent frames
      const preloadWindow = 5;
      for (
        let i = Math.max(0, index - preloadWindow);
        i <= Math.min(totalFrames - 1, index + preloadWindow);
        i++
      ) {
        const url = imageUrls[i];
        if (!loadedImages.has(url)) {
          const img = document.createElement("img"); // Fixed Image constructor
          img.src = url;
        }
      }

      setCurrentImageUrl(newUrl);
      onImageChange?.(index);
    }
  });

  return (
    <div ref={containerRef} className="relative min-h-[1000vh] bg-bgGold">
      <div className="sticky top-0 h-screen flex items-center justify-center z-40">
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.3s ease-out",
          }}
        >
          {currentImageUrl && (
            <Image
              src={currentImageUrl}
              alt="Sequence Frame"
              fill
              priority={currentImageUrl === imageUrls[0]}
              className={cn(
                "object-contain",
                "md:object-cover",
                "transition-opacity duration-200",
                loadedImages.has(currentImageUrl) ? "opacity-100" : "opacity-0"
              )}
              style={{
                backfaceVisibility: "hidden",
                imageRendering: "crisp-edges",
              }}
              loading="eager"
              sizes="(max-width: 768px) 100vw, 50vw"
              onLoadingComplete={() => {
                setLoadedImages((prev) => new Set(prev).add(currentImageUrl));
              }}
            />
          )}
        </motion.div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-bgGold">
            <div className="w-12 h-12 border-4 border-gray-300 rounded-full animate-spin border-t-primary" />
          </div>
        )}
      </div>
    </div>
  );
}

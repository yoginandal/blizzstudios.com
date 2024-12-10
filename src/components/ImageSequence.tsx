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

  // Adjust according to your actual files:
  // Desktop: 253 total images => 000 to 252
  // Mobile: 254 total images => 000 to 253
  const desktopFrames = 253;
  const mobileFrames = 254;
  const totalFrames = isMobile ? mobileFrames : desktopFrames;

  const imageUrlBase = isMobile ? mobileBaseUrl : baseUrl;

  const imageUrls = useMemo(
    () =>
      Array.from(
        { length: totalFrames },
        (_, i) => `${imageUrlBase}${i.toString().padStart(3, "0")}.webp`
      ),
    [imageUrlBase, totalFrames]
  );

  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const preloadImages = useCallback(async () => {
    const loadImage = (url: string) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => {
          // If an image fails to load, we log it and still resolve to avoid halting
          console.error(`Failed to load image: ${url}`);
          resolve();
        };
      });

    try {
      // Preload the first 10 images for a smooth start
      await Promise.all(imageUrls.slice(0, 10).map(loadImage));
      setImagesPreloaded(true);

      // Load remaining images in chunks
      const chunkSize = 20;
      for (let i = 10; i < imageUrls.length; i += chunkSize) {
        const chunk = imageUrls.slice(i, i + chunkSize);
        await Promise.all(chunk.map(loadImage));
      }
    } catch (error) {
      // This catch is just in case of unexpected errors, but it shouldn't occur
      console.error("Error preloading images:", error);
    }
  }, [imageUrls]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Calculate the current frame index based on scroll progress
    const index = Math.round(latest * (totalFrames - 1));
    const newUrl = imageUrls[index];

    if (newUrl && newUrl !== currentImageUrl) {
      setCurrentImageUrl(newUrl);
      onImageChange?.(index);
    }
  });

  return (
    <div ref={containerRef} className="relative min-h-[1000vh] bg-bgGold">
      <div className="sticky top-0 h-screen flex items-center justify-center z-40">
        {imagesPreloaded && currentImageUrl && (
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              opacity: imagesPreloaded ? 1 : 0,
              transition: "opacity 0.5s",
              willChange: "transform",
            }}
          >
            <Image
              src={currentImageUrl}
              alt="Sequence Frame"
              fill
              priority
              className={cn("object-contain", "md:object-cover")}
              style={{
                willChange: "contents",
                backfaceVisibility: "hidden",
              }}
              loading="eager"
              sizes="100vw"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

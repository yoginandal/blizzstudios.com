"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useWindowSize } from "react-use";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageSequenceProps {
  totalFrames?: number;
  baseUrl?: string;
  mobileBaseUrl?: string;
  onImageChange?: (index: number) => void;
}

export function ImageSequence({
  totalFrames = 254,
  baseUrl = "https://blizzstudios.com/wp-content/uploads/laptopsq/",
  mobileBaseUrl = "https://blizzstudios.com/wp-content/uploads/mobileseq/",
  onImageChange,
}: ImageSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const isMobile = width <= 450;
  const imageUrlBase = isMobile ? mobileBaseUrl : baseUrl;

  // Memoize image URLs
  const imageUrls = useMemo(
    () =>
      Array.from(
        { length: totalFrames },
        (_, i) => `${imageUrlBase}${i.toString().padStart(3, "0")}.webp`
      ),
    [imageUrlBase, totalFrames]
  );

  // Memoize the preload function
  const preloadImages = useCallback(async () => {
    try {
      const loadImage = (url: string) =>
        new Promise((resolve, reject) => {
          const img = new window.Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });

      // Load first 10 images with high priority
      await Promise.all(imageUrls.slice(0, 10).map(loadImage));
      setImagesPreloaded(true);

      // Load remaining images in chunks
      const chunkSize = 20;
      for (let i = 10; i < imageUrls.length; i += chunkSize) {
        const chunk = imageUrls.slice(i, i + chunkSize);
        await Promise.all(chunk.map(loadImage));
      }
    } catch (error) {
      console.error("Error preloading images:", error);
    }
  }, [imageUrls]);

  // Preload images
  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });

  const imageIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, totalFrames - 1]
  );

  // Update current image based on scroll with debounce
  const updateImage = useCallback(() => {
    const index = Math.round(imageIndex.get());
    const newUrl = imageUrls[index];
    if (newUrl !== currentImageUrl) {
      setCurrentImageUrl(newUrl);
      onImageChange?.(index);
    }
  }, [imageIndex, imageUrls, currentImageUrl, onImageChange]);

  useEffect(() => {
    const unsubscribe = imageIndex.on("change", () => {
      requestAnimationFrame(updateImage);
    });

    return unsubscribe;
  }, [imageIndex, updateImage]);

  return (
    <div ref={containerRef} className="relative min-h-[400vh]">
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

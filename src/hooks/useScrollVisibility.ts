"use client";

import { useState, useEffect, useCallback } from "react";

interface ScrollVisibilityOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollVisibility({
  threshold = 3000,
  rootMargin = "0px",
}: ScrollVisibilityOptions = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(callback, {
      rootMargin,
      threshold: [0, 0.5, 1],
    });

    observer.observe(element);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > threshold) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callback, element, rootMargin, threshold]);

  return { isVisible, ref: setElement };
}

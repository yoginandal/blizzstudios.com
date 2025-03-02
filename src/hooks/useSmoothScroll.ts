import { useCallback } from "react";

export const useSmoothScroll = () => {
  const scrollTo = useCallback(
    (target: string | HTMLElement | number, options = {}) => {
      const defaultOptions = {
        duration: 800,
        offset: 0,
        easing: (t: number) => 1 - Math.pow(1 - t, 5), // Smooth easing function
      };

      const settings = { ...defaultOptions, ...options };

      const start = window.pageYOffset;
      const startTime =
        "now" in window.performance ? performance.now() : Date.now();

      const getTargetPosition = () => {
        if (typeof target === "number") return target;

        const element =
          typeof target === "string" ? document.querySelector(target) : target;

        if (!element) return start;

        const elementPosition = element.getBoundingClientRect().top;
        return elementPosition + window.pageYOffset - settings.offset;
      };

      const targetPosition = getTargetPosition();
      const distance = targetPosition - start;

      const animation = (currentTime: number) => {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / settings.duration, 1);

        const easeProgress = settings.easing(progress);
        const currentPosition = start + distance * easeProgress;

        window.scrollTo(0, currentPosition);

        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    },
    []
  );

  return { scrollTo };
};

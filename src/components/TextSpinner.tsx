"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

interface TextSpinnerProps {
  items: string[];
  prefix?: string;
  interval?: number;
  hideAtIndex?: number;
  currentImageIndex: number;
}

export function TextSpinner({
  items,
  prefix = "We are",
  interval = 3000,
  hideAtIndex = 21,
  currentImageIndex = 0,
}: TextSpinnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateIndex = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    const timer = setInterval(updateIndex, interval);
    return () => clearInterval(timer);
  }, [interval, updateIndex]);

  if (currentImageIndex >= hideAtIndex) return null;

  return (
    <div className="product-header product-header--default bg-bgGold">
      <div>
        <div className="fixed inset-0 flex items-center justify-center z-30">
          <div className="spinner spinner--default">
            <div className="spinner__suffix">{prefix}</div>
            <div className="spinner__prefix">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
                  style={{
                    position: "absolute",
                    color: "white",
                    whiteSpace: "nowrap",
                    fontSize: "inherit",
                    fontWeight: 600,
                    left: 0,
                    top: 0,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: "0.25rem",
                  }}
                >
                  {items[currentIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

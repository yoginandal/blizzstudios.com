import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionProps,
  MotionValue,
} from "framer-motion";
import { ReactNode, HTMLAttributes } from "react";

interface SmoothScrollProps {
  children: ReactNode;
  showProgressBar?: boolean;
}

// Define properly typed motion components
type MotionDivProps = MotionProps & HTMLAttributes<HTMLDivElement>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

// Helper to correctly type style props with motion values
interface MotionStyle {
  [key: string]: string | number | MotionValue<number> | MotionValue<string>;
}

export function SmoothScroll({
  children,
  showProgressBar = true,
}: SmoothScrollProps) {
  const { scrollYProgress } = useScroll();

  // Smoother spring animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Smooth opacity for progress bar
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <div className="relative">
      {showProgressBar && (
        <MotionDiv
          className="fixed top-0 left-0 right-0 z-50"
          style={{ opacity } as MotionStyle}
        >
          <MotionDiv
            className="h-1 bg-primary origin-left"
            style={{ scaleX } as MotionStyle}
          />
        </MotionDiv>
      )}

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </MotionDiv>
    </div>
  );
}

"use client";

import React from "react";
import { motion, useScroll, useSpring, HTMLMotionProps, Variants } from "motion/react";

const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

/* ==========================================================================
   1. GLOBAL LUXURY SCROLL PROGRESS BAR
   ========================================================================== */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#9b7842] via-[#dec49a] to-[#9b7842] origin-left z-[100] shadow-[0_0_8px_rgba(155,120,66,0.6)] pointer-events-none"
    />
  );
}

/* ==========================================================================
   2. IN-VIEW SMOOTH REVEAL WRAPPER
   ========================================================================== */
interface MotionRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

export function MotionReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.65,
  distance = 28,
  className = "",
  once = true,
  ...props
}: MotionRevealProps) {
  const getInitial = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance };
      case "down":
        return { opacity: 0, y: -distance };
      case "left":
        return { opacity: 0, x: distance };
      case "right":
        return { opacity: 0, x: -distance };
      case "scale":
        return { opacity: 0, scale: 0.92 };
      case "fade":
      default:
        return { opacity: 0 };
    }
  };

  const getAnimate = () => {
    switch (direction) {
      case "up":
      case "down":
        return { opacity: 1, y: 0 };
      case "left":
      case "right":
        return { opacity: 1, x: 0 };
      case "scale":
        return { opacity: 1, scale: 1 };
      case "fade":
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: LUXURY_EASE
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   3. STAGGERED LIST CONTAINER & ITEM
   ========================================================================== */
interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
  once?: boolean;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  delayChildren = 0.05,
  className = "",
  once = true,
  ...props
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-30px" }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  direction = "up",
  distance = 24,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale";
  distance?: number;
} & HTMLMotionProps<"div">) {
  const getVariants = (): Variants => {
    switch (direction) {
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.94 },
          show: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.55, ease: LUXURY_EASE }
          }
        };
      case "left":
        return {
          hidden: { opacity: 0, x: distance },
          show: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.55, ease: LUXURY_EASE }
          }
        };
      case "right":
        return {
          hidden: { opacity: 0, x: -distance },
          show: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.55, ease: LUXURY_EASE }
          }
        };
      case "down":
        return {
          hidden: { opacity: 0, y: -distance },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.55, ease: LUXURY_EASE }
          }
        };
      case "up":
      default:
        return {
          hidden: { opacity: 0, y: distance },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.55, ease: LUXURY_EASE }
          }
        };
    }
  };

  return (
    <motion.div variants={getVariants()} className={className} {...props}>
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   4. HOVER SPRING LIFT
   ========================================================================== */
export function HoverLift({
  children,
  className = "",
  y = -6,
  scale = 1.015,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  scale?: number;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      whileHover={{
        y,
        scale,
        transition: { duration: 0.25, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   5. AMBIENT FLOAT / BREATHING ANIMATION
   ========================================================================== */
export function FloatAnimation({
  children,
  className = "",
  y = 8,
  duration = 4
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [-y / 2, y / 2, -y / 2]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   6. RADAR PULSE FOR LOOKBOOK HOTSPOTS
   ========================================================================== */
export function PulseRadar({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.span
        animate={{
          scale: [1, 2.2],
          opacity: [0.75, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
        className="absolute w-8 h-8 rounded-full bg-[#9b7842]/60 pointer-events-none"
      />
      <motion.span
        animate={{
          scale: [1, 1.6],
          opacity: [0.5, 0]
        }}
        transition={{
          duration: 2,
          delay: 0.5,
          repeat: Infinity,
          ease: "easeOut"
        }}
        className="absolute w-8 h-8 rounded-full bg-[#dec49a]/70 pointer-events-none"
      />
    </div>
  );
}

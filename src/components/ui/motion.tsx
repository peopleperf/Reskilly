import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"

export type MotionDivProps = HTMLMotionProps<"div">
export type MotionSpanProps = HTMLMotionProps<"span">
export type MotionLiProps = HTMLMotionProps<"li">

export const MotionDiv = motion.div
export const MotionSpan = motion.span
export const MotionLi = motion.li

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
}

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

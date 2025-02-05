"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FadeInWrapperProps {
  children: ReactNode
  duration?: number
}

export const AppFadeInWrapper = ({ children, duration = 0.5 }: FadeInWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}


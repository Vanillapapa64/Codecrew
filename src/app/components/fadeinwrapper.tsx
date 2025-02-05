'use client'

import { motion } from 'framer-motion'
import React, { ReactNode } from 'react'

interface FadeInWrapperProps {
  children: ReactNode
  duration?: number
  delay?: number
}

export const FadeInWrapper = ({ children, duration = 0.75, delay = 0.3 }: FadeInWrapperProps) => {
  const childrenArray = React.Children.toArray(children)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      {childrenArray.map((child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

import { motion } from 'motion/react';
import React from 'react';

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export function TextShimmer({ children, className = '', duration = 1.5 }: TextShimmerProps) {
  return (
    <motion.span
      className={`inline-block bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-transparent ${className}`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export const GlassCard: React.FC<HTMLMotionProps<"div">> = ({ children, className, ...props }) => {
  return (
    <motion.div 
      className={`backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-xl ${className || ''}`}
      data-testid="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

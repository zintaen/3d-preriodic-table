import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export const GlassCard: React.FC<HTMLMotionProps<"div">> = ({ children, className, ...props }) => {
  return (
    <motion.div 
      className={`bg-white/70 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl text-slate-800 dark:text-white ${className || ''}`}
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

import React from 'react';
import { motion } from 'framer-motion';
interface FestivalCardProps {
  children: React.ReactNode;
  className?: string;
  accent?: 'magenta' | 'violet' | 'yellow' | 'none';
  delay?: number;
  hoverEffect?: boolean;
}
export function FestivalCard({
  children,
  className = '',
  accent = 'none',
  delay = 0,
  hoverEffect = false
}: FestivalCardProps) {
  const accentStyles = {
    magenta: 'border-l-4 border-l-magenta',
    violet: 'border-l-4 border-l-violet',
    yellow: 'border-l-4 border-l-yellow',
    none: ''
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.4,
        delay
      }}
      whileHover={
      hoverEffect ?
      {
        y: -5,
        boxShadow:
        '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      } :
      {}
      }
      className={`
        bg-white rounded-2xl shadow-sm p-6
        border border-gray-100
        ${accentStyles[accent]}
        ${className}
      `}>

      {children}
    </motion.div>);

}
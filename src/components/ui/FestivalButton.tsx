import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
interface FestivalButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}
export function FestivalButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: FestivalButtonProps) {
  const baseStyles =
  'font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-offset-2';
  const variants = {
    primary:
    'bg-gradient-to-r from-magenta to-violet text-white shadow-lg hover:shadow-xl hover:shadow-magenta/30 border-2 border-transparent',
    secondary: 'bg-white text-violet border-2 border-violet hover:bg-violet/5',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  return (
    <motion.button
      whileHover={{
        scale: disabled || isLoading ? 1 : 1.02
      }}
      whileTap={{
        scale: disabled || isLoading ? 1 : 0.98
      }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}>

      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </motion.button>);

}
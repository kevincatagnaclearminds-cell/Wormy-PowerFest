import React from 'react';
import { motion } from 'framer-motion';
interface FestivalInputProps extends
  React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  error?: string;
  as?: 'input' | 'select';
  children?: React.ReactNode;
}
export function FestivalInput({
  label,
  error,
  as = 'input',
  className = '',
  children,
  ...props
}: FestivalInputProps) {
  const inputClasses = `
    w-full px-4 py-3 rounded-xl border-2 border-gray-200 
    bg-gray-50 text-gray-900 font-medium
    focus:border-magenta focus:ring-0 focus:bg-white
    transition-all duration-300 outline-none
    placeholder:text-gray-400
    ${error ? 'border-red-500 focus:border-red-500' : ''}
    ${className}
  `;
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700 ml-1">
        {label}
      </label>
      <motion.div
        initial={false}
        whileFocus={{
          scale: 1.01
        }}>

        {as === 'select' ?
        <select className={inputClasses} {...props as any}>
            {children}
          </select> :

        <input className={inputClasses} {...props} />
        }
      </motion.div>
      {error &&
      <motion.p
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="text-red-500 text-sm font-medium ml-1">

          {error}
        </motion.p>
      }
    </div>);

}
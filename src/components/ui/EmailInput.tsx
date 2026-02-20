import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  label: string;
  username: string;
  domain: string;
  onUsernameChange: (value: string) => void;
  onDomainChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

const EMAIL_DOMAINS = [
  '@gmail.com',
  '@hotmail.com',
  '@outlook.com',
  '@yahoo.com',
  '@yahoo.es',
  '@icloud.com',
  '@live.com',
  '@msn.com',
  '@hotmail.es',
  '@outlook.es',
  '@protonmail.com',
  '@aol.com',
];

export function EmailInput({
  label,
  username,
  domain,
  onUsernameChange,
  onDomainChange,
  error,
  required = false,
}: EmailInputProps) {
  const inputClasses = `
    flex-1 pl-10 pr-4 py-3 rounded-l-xl border-2 border-r-0 border-gray-200 
    bg-gray-50 text-gray-900 font-medium
    focus:border-magenta focus:ring-0 focus:bg-white focus:z-10
    transition-all duration-300 outline-none
    placeholder:text-gray-400
    ${error ? 'border-red-500 focus:border-red-500' : ''}
  `;

  const selectClasses = `
    px-4 py-3 rounded-r-xl border-2 border-l-0 border-gray-200 
    bg-gray-50 text-gray-900 font-medium
    focus:border-magenta focus:ring-0 focus:bg-white focus:z-10
    transition-all duration-300 outline-none cursor-pointer
    ${error ? 'border-red-500 focus:border-red-500' : ''}
  `;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700 ml-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div className="flex items-center">
          <motion.input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="usuario"
            className={inputClasses}
            initial={false}
            whileFocus={{ scale: 1.01 }}
          />
          
          <motion.select
            value={domain}
            onChange={(e) => onDomainChange(e.target.value)}
            className={selectClasses}
            initial={false}
            whileFocus={{ scale: 1.01 }}
          >
            {EMAIL_DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Mail className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium ml-1"
        >
          {error}
        </motion.p>
      )}

      <p className="text-xs text-gray-500 ml-1">
        Email completo: {username || 'usuario'}{domain}
      </p>
    </div>
  );
}

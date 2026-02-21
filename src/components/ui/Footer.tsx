import { motion } from 'framer-motion';
import logoHeader from '../../assets/logos/footer-logos.jpeg';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-r from-magenta/5 via-violet/5 to-yellow/5 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-6"
        >
          {/* Logo */}
          <div className="flex items-center justify-center">
            <img
              src={logoHeader}
              alt="Warmi PowerFest"
              className="h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-magenta via-violet to-yellow rounded-full"></div>

          {/* Copyright Text */}
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-600">
              © {currentYear} Warmi PowerFest
            </p>
            <p className="text-xs text-gray-500">
              Todos los derechos reservados
            </p>
          </div>

          {/* Optional: Social links or additional info */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="hover:text-magenta transition-colors cursor-pointer">
              Términos y Condiciones
            </span>
            <span className="text-gray-300">•</span>
            <span className="hover:text-magenta transition-colors cursor-pointer">
              Política de Privacidad
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

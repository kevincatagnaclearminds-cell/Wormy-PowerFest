// Validaciones para formularios

/**
 * Valida formato de teléfono ecuatoriano
 * Formato: 09XXXXXXXX (10 dígitos, empieza con 09)
 */
export const validateEcuadorPhone = (phone: string): boolean => {
  // Remover espacios y caracteres especiales
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Debe tener exactamente 10 dígitos y empezar con 09
  const phoneRegex = /^09\d{8}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Formatea el teléfono mientras el usuario escribe
 * Limita a 10 dígitos y solo permite números
 */
export const formatEcuadorPhone = (value: string): string => {
  // Solo permitir números
  const numbers = value.replace(/\D/g, '');

  // Limitar a 10 dígitos
  const limited = numbers.slice(0, 10);

  return limited;
};

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida nombre (solo letras y espacios)
 */
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
  return nameRegex.test(name);
};

/**
 * Valida cédula ecuatoriana
 * Formato: 10 dígitos con validación de dígito verificador
 */
export const validateEcuadorCedula = (cedula: string): boolean => {
  // Remover espacios
  const cleanCedula = cedula.replace(/\s/g, '');

  // Debe tener exactamente 10 dígitos
  const cedulaRegex = /^\d{10}$/;
  if (!cedulaRegex.test(cleanCedula)) {
    return false;
  }

  // Validar código de provincia (primeros 2 dígitos)
  const province = parseInt(cleanCedula.substring(0, 2));
  if (province < 1 || province > 24) {
    return false;
  }

  // Validar dígito verificador
  const digits = cleanCedula.split('').map(Number);
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    let value = digits[i] * coefficients[i];
    if (value >= 10) value -= 9;
    sum += value;
  }

  const verifier = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  
  return verifier === digits[9];
};

/**
 * Formatea la cédula mientras el usuario escribe
 * Limita a 10 dígitos y solo permite números
 */
export const formatEcuadorCedula = (value: string): string => {
  // Solo permitir números
  const numbers = value.replace(/\D/g, '');

  // Limitar a 10 dígitos
  const limited = numbers.slice(0, 10);

  return limited;
};

/**
 * Valida edad
 */
export const validateEdad = (edad: number | string): boolean => {
  const edadNum = typeof edad === 'string' ? parseInt(edad) : edad;
  
  if (isNaN(edadNum)) return false;
  
  return edadNum >= 5 && edadNum <= 120;
};

/**
 * Valida sector
 */
export const validateSector = (sector: string): boolean => {
  if (!sector) return true; // Opcional
  return sector.length <= 100;
};

/**
 * Mensajes de error
 */
export const ERROR_MESSAGES = {
  PHONE_INVALID: 'El teléfono debe tener 10 dígitos y empezar con 09',
  PHONE_REQUIRED: 'El teléfono es requerido',
  EMAIL_INVALID: 'El correo electrónico no es válido',
  EMAIL_REQUIRED: 'El correo electrónico es requerido',
  NAME_INVALID: 'El nombre solo puede contener letras',
  NAME_REQUIRED: 'El nombre es requerido',
  SPORTS_REQUIRED: 'Debes seleccionar al menos un deporte',
  CEDULA_INVALID: 'Cédula inválida',
  CEDULA_REQUIRED: 'La cédula es requerida',
  EDAD_INVALID: 'La edad debe estar entre 5 y 120 años',
  EDAD_REQUIRED: 'La edad es requerida',
  SECTOR_TOO_LONG: 'El sector no puede tener más de 100 caracteres',
  SECTOR_REQUIRED: 'El sector es requerido',
} as const;

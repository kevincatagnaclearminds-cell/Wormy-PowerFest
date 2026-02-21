# ✅ Validaciones - Wormy PowerFest

## 📱 Validación de Teléfono Ecuatoriano

### Formato Aceptado
```
0990900990
```

### Reglas
- ✅ Exactamente 10 dígitos
- ✅ Debe empezar con `09`
- ✅ Solo números (sin espacios, guiones, paréntesis)
- ✅ Formato automático mientras escribes

### Ejemplos Válidos
```
0990900990 ✅
0987654321 ✅
0991234567 ✅
0999999999 ✅
```

### Ejemplos Inválidos
```
990900990   ❌ (9 dígitos, falta el 0)
1990900990  ❌ (no empieza con 09)
0890900990  ❌ (no empieza con 09)
09909009901 ❌ (11 dígitos, muy largo)
09 9090 0990 ❌ (con espacios, se limpian automáticamente)
```

---

## 📧 Validación de Email

### Formato Aceptado
```
usuario@dominio.com
```

### Reglas
- ✅ Debe contener `@`
- ✅ Debe tener dominio válido
- ✅ Sin espacios

### Ejemplos Válidos
```
alex@ejemplo.com ✅
maria.gonzalez@gmail.com ✅
juan_perez@empresa.ec ✅
```

### Ejemplos Inválidos
```
alex@ejemplo ❌ (sin extensión)
@ejemplo.com ❌ (sin usuario)
alex ejemplo.com ❌ (sin @)
```

---

## 👤 Validación de Nombres

### Formato Aceptado
```
Alex
María José
Juan Carlos
```

### Reglas
- ✅ Solo letras (incluye tildes y ñ)
- ✅ Espacios permitidos
- ✅ Mínimo 2 caracteres
- ✅ Máximo 50 caracteres

### Ejemplos Válidos
```
Alex ✅
María ✅
José Luis ✅
Ángel ✅
```

### Ejemplos Inválidos
```
Alex123 ❌ (contiene números)
A ❌ (muy corto)
Alex-Rivera ❌ (contiene guión)
```

---

## 🏃 Validación de Deportes

### Reglas
- ✅ Debe seleccionar al menos 1 deporte
- ✅ Si selecciona "Ninguno", no puede seleccionar otros
- ✅ Si selecciona otros, "Ninguno" se deselecciona automáticamente

### Deportes Disponibles
- 🏃 Correr
- 🏊 Nadar
- 💪 Gimnasio
- ❌ Ninguno

---

## 🎯 Comportamiento del Formulario

### Paso 1: Datos Personales

1. **Mientras escribes:**
   - Los errores se limpian automáticamente
   - El teléfono se limita a 10 dígitos
   - Solo se permiten números en el teléfono

2. **Al hacer clic en "Siguiente":**
   - Se validan todos los campos
   - Se muestran errores específicos
   - No avanza si hay errores

### Paso 2: Selección de Deportes

1. **Arrastra deportes** de "Disponibles" a "Tu Selección"
2. **Lógica especial:**
   - Si arrastras "Ninguno", se limpian los demás
   - Si arrastras un deporte, "Ninguno" se elimina

### Paso 3: Confirmación

1. **Se genera el ticket** con código QR
2. **Se simula envío** por email y WhatsApp
3. **Confetti animado** 🎉

---

## 🔧 Implementación Técnica

### Archivo: `src/utils/validation.ts`

```typescript
// Valida teléfono ecuatoriano (10 dígitos, empieza con 09)
export const validateEcuadorPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^09\d{8}$/;
  return phoneRegex.test(cleanPhone);
};

// Formatea el teléfono (solo números, máximo 10)
export const formatEcuadorPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.slice(0, 10);
};

// Valida email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Valida nombre (solo letras)
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
  return nameRegex.test(name);
};
```

---

## 🧪 Casos de Prueba

### Test 1: Teléfono Válido
```
Input: 0990900990
Resultado: ✅ Válido
```

### Test 2: Teléfono Inválido (no empieza con 09)
```
Input: 1990900990
Resultado: ❌ "El teléfono debe tener 10 dígitos y empezar con 09"
```

### Test 3: Teléfono Corto
```
Input: 099090099
Resultado: ❌ "El teléfono debe tener 10 dígitos y empezar con 09"
```

### Test 4: Teléfono con Letras
```
Input: 099090099a
Resultado: Se limpia automáticamente a "099090099"
```

### Test 5: Email Válido
```
Input: alex@ejemplo.com
Resultado: ✅ Válido
```

### Test 6: Email Inválido
```
Input: alex@ejemplo
Resultado: ❌ "El correo electrónico no es válido"
```

### Test 7: Nombre con Números
```
Input: Alex123
Resultado: ❌ "El nombre solo puede contener letras"
```

### Test 8: Nombre Válido con Tilde
```
Input: María
Resultado: ✅ Válido
```

---

## 📱 Experiencia de Usuario

### Feedback Visual

1. **Campo sin error:**
   - Borde gris
   - Al hacer focus: borde magenta

2. **Campo con error:**
   - Borde rojo
   - Mensaje de error debajo en rojo
   - Animación suave al aparecer

3. **Campo válido:**
   - Borde gris normal
   - Sin mensaje de error

### Mensajes de Ayuda

- **Teléfono:** "Ingresa 10 dígitos, empezando con 09"
- **Email:** "Recibirás tu código QR por correo"

---

## 🚀 Mejoras Futuras (Opcional)

### Validación en Tiempo Real
```typescript
// Validar mientras escribe (debounced)
const [isValidating, setIsValidating] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => {
    if (formData.phone) {
      setIsValidating(true);
      const isValid = validateEcuadorPhone(formData.phone);
      // Mostrar indicador visual
      setIsValidating(false);
    }
  }, 500);
  
  return () => clearTimeout(timer);
}, [formData.phone]);
```

### Autocompletado de Teléfono
```typescript
// Si el usuario empieza con 9, agregar el 0 automáticamente
if (value.startsWith('9') && value.length === 1) {
  return '0' + value;
}
```

### Verificación de Email Duplicado
```typescript
// Verificar en el backend si el email ya existe
const checkEmailExists = async (email: string) => {
  const response = await fetch(`/api/check-email?email=${email}`);
  const data = await response.json();
  return data.exists;
};
```

---

## 📚 Recursos

- [Regex101](https://regex101.com/) - Probar expresiones regulares
- [React Hook Form](https://react-hook-form.com/) - Librería de formularios (alternativa)
- [Yup](https://github.com/jquense/yup) - Validación de schemas (alternativa)

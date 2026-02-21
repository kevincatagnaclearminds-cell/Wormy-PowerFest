# 🔌 Frontend API Integration - Wormy PowerFest

## ✅ Integración Completada

Tu frontend ahora está completamente integrado con el backend a través de servicios API.

---

## 📁 Estructura de Archivos Creados

```
src/
├── config/
│   └── api.ts                      # Configuración de API (URLs, endpoints)
├── services/
│   ├── index.ts                    # Exporta todos los servicios
│   ├── api.service.ts              # Servicio base para llamadas HTTP
│   ├── registration.service.ts     # Servicio de registros
│   ├── verification.service.ts     # Servicio de verificación
│   └── stats.service.ts            # Servicio de estadísticas
└── hooks/
    └── useEventData.ts             # Hook actualizado con API real
```

---

## 🔧 Configuración

### Variables de Entorno (`.env`)

```env
VITE_API_URL=http://localhost:3001/api
```

### Archivo de Configuración (`src/config/api.ts`)

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  REGISTER: '/registrations',
  GET_REGISTRATIONS: '/registrations',
  GET_REGISTRATION_BY_ID: (id: string) => `/registrations/${id}`,
  VERIFY_TICKET: '/verify',
  CHECK_IN: (id: string) => `/registrations/${id}/check-in`,
  GET_STATS: '/stats',
};
```

---

## 📡 Servicios Disponibles

### 1. Registration Service

```typescript
import { registrationService } from '../services';

// Crear nuevo registro
const response = await registrationService.create({
  firstName: 'Alex',
  lastName: 'Rivera',
  phone: '+34 612 345 678',
  email: 'alex@example.com',
  sports: ['Correr', 'Gimnasio']
});

// Obtener todos los registros
const allRegistrations = await registrationService.getAll();

// Obtener con filtros
const pendingOnly = await registrationService.getAll({
  status: 'PENDING',
  limit: 50,
  offset: 0
});

// Obtener por ID
const registration = await registrationService.getById('clxxx123');

// Actualizar estado
const updated = await registrationService.updateStatus('clxxx123', 'CHECKED_IN');
```

### 2. Verification Service

```typescript
import { verificationService } from '../services';

// Verificar ticket
const result = await verificationService.verifyTicket('clxxx123');

if (result.success && result.data) {
  switch (result.data.status) {
    case 'success':
      console.log('Check-in exitoso!');
      break;
    case 'already_used':
      console.log('Ticket ya usado');
      break;
    case 'not_found':
      console.log('Ticket no encontrado');
      break;
  }
}

// Check-in manual
const checkIn = await verificationService.checkIn('clxxx123');
```

### 3. Stats Service

```typescript
import { statsService } from '../services';

// Obtener estadísticas
const stats = await statsService.getStats();

if (stats.success && stats.data) {
  console.log('Total:', stats.data.total);
  console.log('Checked In:', stats.data.checkedIn);
  console.log('Pending:', stats.data.pending);
  console.log('Sports Breakdown:', stats.data.sportBreakdown);
  console.log('Recent Scans:', stats.data.recentScans);
}
```

---

## 🎣 Hook: useEventData

El hook principal que usa todos los servicios:

```typescript
import { useEventData } from '../hooks/useEventData';

function MyComponent() {
  const {
    attendees,      // Lista de asistentes
    stats,          // Estadísticas del evento
    isLoading,      // Estado de carga
    error,          // Mensaje de error
    addRegistration,// Función para crear registro
    verifyTicket,   // Función para verificar ticket
    refreshData     // Función para recargar datos
  } = useEventData();

  // Crear registro
  const handleRegister = async () => {
    try {
      const newAttendee = await addRegistration(
        'Alex',
        'Rivera',
        '+34 612 345 678',
        'alex@example.com',
        ['Correr', 'Gimnasio']
      );
      console.log('Registro creado:', newAttendee);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Verificar ticket
  const handleVerify = async (ticketId: string) => {
    const result = await verifyTicket(ticketId);
    console.log('Resultado:', result);
  };

  return (
    <div>
      {isLoading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <p>Total: {stats.total}</p>
      <button onClick={refreshData}>Recargar</button>
    </div>
  );
}
```

---

## 🔄 Manejo de Respuestas

Todas las respuestas siguen este formato:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
}
```

### Ejemplo de Uso

```typescript
const response = await registrationService.create(data);

if (response.success && response.data) {
  // Éxito
  console.log('Registro creado:', response.data);
} else {
  // Error
  console.error('Error:', response.error);
  alert(response.error);
}
```

---

## 🚨 Manejo de Errores

### Errores de Red

```typescript
try {
  const response = await registrationService.create(data);
  if (!response.success) {
    throw new Error(response.error);
  }
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  }
}
```

### Timeout

El timeout está configurado en 10 segundos. Si una petición tarda más:

```typescript
{
  success: false,
  error: 'La solicitud tardó demasiado tiempo'
}
```

---

## 🔍 Debugging

### Ver Requests en la Consola

```typescript
// En api.service.ts, agrega logs:
console.log('Request:', url, options);
console.log('Response:', data);
```

### Verificar Conexión

```bash
# Verificar que el backend esté corriendo
curl http://localhost:3001/api/stats

# Verificar CORS
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  http://localhost:3001/api/registrations
```

---

## 📝 Páginas Actualizadas

### ✅ RegistrationPage.tsx
- Usa `addRegistration()` del hook
- Maneja errores con try/catch
- Muestra loading state durante el registro

### ✅ AdminDashboard.tsx
- Carga datos automáticamente al montar
- Muestra loading y error states
- Botón de refresh para recargar datos

### ✅ VerificationPage.tsx
- Usa `verifyTicket()` del hook
- Maneja los 3 estados: success, already_used, not_found
- Muestra información del asistente

---

## 🧪 Testing

### Test Manual

1. **Iniciar Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Iniciar Frontend**
   ```bash
   npm run dev
   ```

3. **Probar Registro**
   - Ir a la página de registro
   - Llenar el formulario
   - Verificar que se cree en el backend

4. **Probar Dashboard**
   - Ir al panel de admin
   - Verificar que se muestren los registros
   - Verificar estadísticas

5. **Probar Verificación**
   - Copiar un ID de registro
   - Ir a verificación
   - Escanear el código

---

## 🔐 Seguridad

### Headers

Todas las peticiones incluyen:
```typescript
headers: {
  'Content-Type': 'application/json',
}
```

### CORS

El backend debe permitir:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## 🚀 Próximos Pasos

1. ✅ Backend implementado y corriendo
2. ✅ Frontend conectado a la API
3. ⏳ Probar flujo completo
4. ⏳ Agregar autenticación (opcional)
5. ⏳ Deploy a producción

---

## 📚 Recursos

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## 🐛 Problemas Comunes

### Error: "Failed to fetch"
- Verifica que el backend esté corriendo
- Verifica la URL en `.env`
- Verifica CORS en el backend

### Error: "Network request failed"
- Verifica tu conexión a internet
- Verifica que el puerto 3001 esté disponible

### Error: "Timeout"
- El backend está tardando mucho
- Verifica la conexión a la base de datos
- Aumenta el timeout en `api.ts`

---

## ✨ Características Implementadas

- ✅ Crear registros
- ✅ Listar registros
- ✅ Obtener estadísticas
- ✅ Verificar tickets
- ✅ Check-in automático
- ✅ Loading states
- ✅ Error handling
- ✅ Auto-refresh de datos
- ✅ Timeout handling
- ✅ TypeScript types completos

# 🇪🇨 Configuración para Ecuador - Wormy PowerFest

## ✅ Configuración Actualizada

### Puerto del Backend
```
http://localhost:3003/api
```

### Formato de Teléfono
```
+593 9 XXX XXXX
```

Ejemplos válidos:
- `+593 9 123 4567`
- `+593 9 987 6543`
- `+593 9 555 1234`

---

## 📝 Archivos Actualizados

### 1. `.env`
```env
VITE_API_URL=http://localhost:3003/api
```

### 2. `src/config/api.ts`
```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3003/api',
  TIMEOUT: 10000,
};
```

### 3. `src/pages/RegistrationPage.tsx`
```typescript
<FestivalInput
  label="Teléfono"
  type="tel"
  placeholder="+593 9 XXX XXXX"
  // ...
/>
```

---

## 🧪 Ejemplo de Registro

```json
{
  "firstName": "María",
  "lastName": "González",
  "phone": "+593 9 123 4567",
  "email": "maria.gonzalez@example.com",
  "sports": ["Correr", "Gimnasio"]
}
```

---

## 🚀 Iniciar el Frontend

1. **Asegúrate de que el backend esté corriendo en el puerto 3003**
   ```bash
   # En la carpeta del backend
   npm run dev
   ```

2. **Reinicia el frontend para que tome los cambios**
   ```bash
   # Detén el servidor (Ctrl+C)
   npm run dev
   ```

3. **Abre el navegador**
   ```
   http://localhost:5173
   ```

---

## ✅ Checklist de Conexión

- [x] Backend corriendo en puerto 3003
- [x] `.env` actualizado con puerto 3003
- [x] `api.ts` actualizado con puerto 3003
- [x] Placeholder de teléfono actualizado a formato ecuatoriano
- [ ] Frontend reiniciado
- [ ] Probar crear un registro
- [ ] Verificar que llegue al backend

---

## 🧪 Probar la Conexión

### Desde el navegador (DevTools Console):

```javascript
// Probar conexión al backend
fetch('http://localhost:3003/api/stats')
  .then(res => res.json())
  .then(data => console.log('Stats:', data))
  .catch(err => console.error('Error:', err));
```

### Crear un registro de prueba:

```javascript
fetch('http://localhost:3003/api/registrations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'María',
    lastName: 'González',
    phone: '+593 9 123 4567',
    email: 'maria@example.com',
    sports: ['Correr', 'Gimnasio']
  })
})
  .then(res => res.json())
  .then(data => console.log('Registro creado:', data))
  .catch(err => console.error('Error:', err));
```

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"
1. Verifica que el backend esté corriendo:
   ```bash
   curl http://localhost:3003/api/stats
   ```

2. Verifica CORS en el backend (debe permitir `http://localhost:5173`)

### Error: "Invalid phone format"
- Asegúrate de usar el formato: `+593 9 XXX XXXX`
- Ejemplo válido: `+593 9 123 4567`

### El frontend no se conecta
1. Reinicia el servidor de desarrollo
2. Limpia la caché del navegador (Ctrl+Shift+R)
3. Verifica el `.env` y que tenga el puerto correcto

---

## 📱 Formato de Teléfono Ecuatoriano

### Estructura
```
+593 9 XXX XXXX
 │   │  │   │
 │   │  │   └─ 4 dígitos
 │   │  └───── 3 dígitos
 │   └──────── Código móvil (9)
 └──────────── Código país Ecuador (+593)
```

### Ejemplos Válidos
- `+593 9 123 4567`
- `+593 9 987 6543`
- `+593 9 555 1234`
- `+593 9 999 9999`

### Regex de Validación (Backend)
```regex
/^\+593\s?9\s?\d{3}\s?\d{4}$/
```

---

## 🎯 Próximos Pasos

1. ✅ Configuración actualizada
2. ⏳ Reiniciar frontend
3. ⏳ Probar crear registro
4. ⏳ Verificar en el dashboard
5. ⏳ Probar verificación de tickets

---

## 📞 Contactos de Prueba

Usa estos datos para probar:

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+593 9 111 1111",
  "email": "juan.perez@test.com",
  "sports": ["Correr"]
}
```

```json
{
  "firstName": "Ana",
  "lastName": "Morales",
  "phone": "+593 9 222 2222",
  "email": "ana.morales@test.com",
  "sports": ["Nadar", "Gimnasio"]
}
```

```json
{
  "firstName": "Carlos",
  "lastName": "Ramírez",
  "phone": "+593 9 333 3333",
  "email": "carlos.ramirez@test.com",
  "sports": ["Gimnasio"]
}
```

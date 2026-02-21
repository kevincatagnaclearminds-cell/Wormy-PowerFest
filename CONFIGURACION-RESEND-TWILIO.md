# 🚀 Configuración de Resend y Twilio

## 📧 Paso 1: Configurar Resend (Email)

### 1.1 Crear cuenta
1. Ve a [https://resend.com/signup](https://resend.com/signup)
2. Regístrate con tu email
3. Verifica tu email

### 1.2 Obtener API Key
1. Una vez dentro, ve a **API Keys** en el menú lateral
2. Click en **Create API Key**
3. Dale un nombre (ej: "Wormy PowerFest")
4. Copia la API Key (empieza con `re_...`)
5. ⚠️ **IMPORTANTE**: Guárdala, solo se muestra una vez

### 1.3 Configurar dominio (Opcional pero recomendado)
- **Opción A**: Usar el dominio de prueba `onboarding@resend.dev` (solo envía a tu email)
- **Opción B**: Agregar tu propio dominio:
  1. Ve a **Domains** > **Add Domain**
  2. Ingresa tu dominio (ej: `tudominio.com`)
  3. Agrega los registros DNS que te indican
  4. Espera verificación (5-10 min)

---

## 📱 Paso 2: Configurar Twilio (WhatsApp)

### 2.1 Crear cuenta
1. Ve a [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Regístrate (recibes $15 de crédito gratis)
3. Verifica tu teléfono

### 2.2 Obtener credenciales
1. En el Dashboard, encontrarás:
   - **Account SID** (empieza con `AC...`)
   - **Auth Token** (click en "Show" para verlo)
2. Cópialos

### 2.3 Configurar WhatsApp Sandbox (Para pruebas)
1. En el menú lateral: **Messaging** > **Try it out** > **Send a WhatsApp message**
2. Verás un número de WhatsApp (ej: `+1 415 523 8886`)
3. **Activar tu WhatsApp**:
   - Abre WhatsApp en tu teléfono
   - Envía un mensaje al número de Twilio
   - El mensaje debe ser el código que te dan (ej: `join <palabra-clave>`)
   - Recibirás confirmación

### 2.4 Para producción (Opcional)
Si quieres enviar a cualquier número sin activación previa:
1. Ve a **Messaging** > **WhatsApp** > **Senders**
2. Solicita un número de WhatsApp Business
3. Completa el proceso de verificación (puede tomar días)

---

## 🔧 Paso 3: Configurar el Backend

### 3.1 Instalar dependencias
```bash
cd backend
npm install resend twilio qrcode
```

### 3.2 Actualizar `.env`
```env
# Database
DATABASE_URL="tu-connection-string-de-neon"

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Resend (Email)
RESEND_API_KEY=re_tu_api_key_aqui
FROM_EMAIL=onboarding@resend.dev
# Si tienes dominio propio: FROM_EMAIL=noreply@tudominio.com

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
# Nota: El número puede variar según tu región

# App Info
APP_NAME=Wormy PowerFest
APP_URL=http://localhost:5173
```

---

## ✅ Paso 4: Verificar configuración

### Probar Resend
```bash
# En el backend, crea un archivo test-resend.js
node test-resend.js
```

### Probar Twilio
```bash
# En el backend, crea un archivo test-twilio.js
node test-twilio.js
```

---

## 📝 Notas Importantes

### Resend
- ✅ 3000 emails gratis/mes
- ✅ Sin tarjeta de crédito requerida
- ⚠️ Con `onboarding@resend.dev` solo puedes enviar a tu email verificado
- ✅ Con dominio propio puedes enviar a cualquier email

### Twilio
- ✅ $15 de crédito gratis
- ⚠️ En modo Sandbox, los usuarios deben activar su WhatsApp primero
- ⚠️ Cada mensaje cuesta ~$0.005
- ✅ Para producción, necesitas número de WhatsApp Business verificado

### Formato de teléfonos
Los números deben estar en formato internacional:
- ✅ `+34612345678` (España)
- ✅ `+521234567890` (México)
- ✅ `+5491123456789` (Argentina)
- ❌ `612345678` (sin código de país)

---

## 🎯 Siguiente Paso

Una vez que tengas:
- ✅ API Key de Resend
- ✅ Account SID y Auth Token de Twilio
- ✅ WhatsApp Sandbox activado en tu teléfono
- ✅ Variables en `.env` configuradas

Dime "listo" y te creo todo el código del backend para enviar los QR.

# 📱📧 Envío de QR por WhatsApp y Email

## Opciones para Enviar QR

### 🟢 Opción 1: Servicios Gratuitos/Simples (Recomendado para empezar)

#### WhatsApp
**Usando WhatsApp Web API (Gratis, pero manual)**
- Abre WhatsApp Web en el navegador
- El QR se descarga y lo envías manualmente

**Usando Twilio WhatsApp (Tiene plan gratuito limitado)**
```bash
npm install twilio
```

#### Email
**Usando Resend (Gratis hasta 3000 emails/mes)**
```bash
npm install resend
```

---

### 🔵 Opción 2: Servicios Profesionales (Para producción)

#### WhatsApp Business API
- **Twilio**: $0.005 por mensaje
- **MessageBird**: Similar pricing
- **WhatsApp Business API oficial**: Requiere aprobación

#### Email
- **Resend**: 3000 gratis/mes, luego $20/mes
- **SendGrid**: 100 gratis/día
- **Mailgun**: 5000 gratis/mes
- **Gmail SMTP**: Gratis pero limitado

---

## 🚀 Implementación Recomendada

### Para Email: Resend (Más fácil y moderno)

#### 1. Crear cuenta en Resend
1. Ve a [https://resend.com](https://resend.com)
2. Regístrate gratis
3. Verifica tu email
4. Ve a "API Keys" y crea una nueva key

#### 2. Instalar en el backend
```bash
cd backend
npm install resend
```

#### 3. Agregar a `.env`
```env
RESEND_API_KEY=re_tu_api_key_aqui
FROM_EMAIL=onboarding@resend.dev
```

#### 4. Código del servicio de email
```typescript
// backend/src/services/email.service.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendQREmail(
  email: string,
  firstName: string,
  qrCodeDataUrl: string,
  ticketId: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: '🎟️ Tu entrada para Wormy PowerFest',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #E91E8C;">¡Hola ${firstName}! 🐛</h1>
          <p>Tu registro para <strong>Wormy PowerFest</strong> ha sido confirmado.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center;">
            <h2>Tu Código QR</h2>
            <img src="${qrCodeDataUrl}" alt="QR Code" style="max-width: 300px;"/>
            <p style="font-family: monospace; color: #666;">ID: ${ticketId}</p>
          </div>
          
          <p style="margin-top: 20px;">
            Presenta este código QR en la entrada del evento.
          </p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Wormy PowerFest - El evento deportivo más divertido del año
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
```

---

### Para WhatsApp: Twilio

#### 1. Crear cuenta en Twilio
1. Ve a [https://www.twilio.com](https://www.twilio.com)
2. Regístrate (tienen $15 de crédito gratis)
3. Ve a Console > WhatsApp > Senders
4. Configura un número de WhatsApp

#### 2. Instalar en el backend
```bash
cd backend
npm install twilio
```

#### 3. Agregar a `.env`
```env
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

#### 4. Código del servicio de WhatsApp
```typescript
// backend/src/services/whatsapp.service.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendQRWhatsApp(
  phone: string,
  firstName: string,
  qrCodeUrl: string,
  ticketId: string
) {
  try {
    // Asegúrate de que el teléfono tenga formato internacional
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${formattedPhone}`,
      body: `🎟️ ¡Hola ${firstName}!

Tu registro para Wormy PowerFest ha sido confirmado.

ID: ${ticketId}

Presenta este código QR en la entrada del evento.`,
      mediaUrl: [qrCodeUrl], // URL pública del QR
    });

    return { success: true, data: message };
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    return { success: false, error };
  }
}
```

---

## 🎯 Alternativa Simple: Solo Frontend (Sin Backend)

Si no quieres configurar servicios de terceros todavía, puedes:

### 1. Descargar el QR automáticamente
```typescript
// En RegistrationPage.tsx después de generar el ticket
const downloadQR = () => {
  const svg = document.getElementById('qr-code');
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const pngFile = canvas.toDataURL('image/png');
    
    const downloadLink = document.createElement('a');
    downloadLink.download = `wormy-powerfest-${ticketData.id}.png`;
    downloadLink.href = pngFile;
    downloadLink.click();
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
};
```

### 2. Compartir por WhatsApp (Abre WhatsApp Web)
```typescript
const shareWhatsApp = () => {
  const message = encodeURIComponent(
    `🎟️ Mi entrada para Wormy PowerFest\nID: ${ticketData.id}`
  );
  window.open(`https://wa.me/?text=${message}`, '_blank');
};
```

### 3. Compartir por Email (Abre cliente de email)
```typescript
const shareEmail = () => {
  const subject = encodeURIComponent('Mi entrada para Wormy PowerFest');
  const body = encodeURIComponent(
    `¡Hola!\n\nAquí está mi entrada para Wormy PowerFest.\nID: ${ticketData.id}`
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};
```

---

## 📊 Comparación de Opciones

| Servicio | Costo | Facilidad | Recomendado |
|----------|-------|-----------|-------------|
| **Resend (Email)** | 3000 gratis/mes | ⭐⭐⭐⭐⭐ | ✅ Sí |
| **SendGrid (Email)** | 100 gratis/día | ⭐⭐⭐⭐ | ✅ Sí |
| **Gmail SMTP** | Gratis | ⭐⭐⭐ | Para pruebas |
| **Twilio WhatsApp** | $15 gratis inicial | ⭐⭐⭐⭐ | ✅ Sí |
| **WhatsApp Business API** | Variable | ⭐⭐ | Para empresas |
| **Solo Frontend** | Gratis | ⭐⭐⭐⭐⭐ | Para empezar |

---

## 🎬 ¿Qué opción prefieres?

1. **Resend para Email** (Recomendado - Fácil y gratis)
2. **Twilio para WhatsApp** (Profesional - $15 gratis)
3. **Solo Frontend** (Más simple - Sin configuración)
4. **Otra opción**

Dime cuál prefieres y te ayudo a implementarla completa.

# 🚀 Crear Backend en Carpeta Separada

## 📁 Estructura Recomendada

```
tu-proyecto/
├── wormy-powerfest-frontend/    ← Tu proyecto actual (React)
│   ├── src/
│   ├── package.json
│   └── ...
│
└── wormy-powerfest-backend/     ← Nuevo proyecto (Node.js)
    ├── src/
    ├── prisma/
    ├── package.json
    └── ...
```

---

## 🛠️ Pasos para Crear el Backend

### 1. Sal de la carpeta actual y crea el backend

```bash
# Sal de la carpeta del frontend
cd ..

# Crea la carpeta del backend
mkdir wormy-powerfest-backend
cd wormy-powerfest-backend

# Inicializa el proyecto
npm init -y
```

### 2. Instala las dependencias

```bash
npm install express cors dotenv prisma @prisma/client qrcode resend twilio
npm install -D typescript @types/node @types/express @types/cors tsx @types/qrcode
```

### 3. Inicializa TypeScript

```bash
npx tsc --init
```

### 4. Inicializa Prisma

```bash
npx prisma init
```

---

## 📝 Archivos a Crear

Te voy a crear un archivo ZIP conceptual con todos los archivos que necesitas.
Por ahora, aquí están los comandos para crear la estructura:

```bash
# Crear estructura de carpetas
mkdir -p src/controllers
mkdir -p src/routes
mkdir -p src/services
mkdir -p src/middleware
mkdir -p src/types
mkdir -p src/config
```

---

## 🔧 Configuración Básica

### package.json (actualizar scripts)
```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

### tsconfig.json (actualizar)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## 🎯 Alternativa: Backend en Subcarpeta

Si prefieres tener todo en un solo repositorio:

```bash
# Desde la raíz de tu proyecto actual
mkdir backend
cd backend
npm init -y
# ... continuar con la instalación
```

Estructura:
```
wormy-powerfest/
├── src/              ← Frontend (React)
├── backend/          ← Backend (Node.js)
│   ├── src/
│   ├── prisma/
│   └── package.json
├── package.json      ← Frontend
└── ...
```

---

## ✅ ¿Qué Prefieres?

**Opción A**: Backend en carpeta separada (recomendado)
- Proyectos independientes
- Más fácil de desplegar por separado
- Mejor organización

**Opción B**: Backend como subcarpeta
- Todo en un repositorio
- Más fácil de compartir
- Monorepo simple

**Opción C**: Te creo todos los archivos del backend aquí y tú los mueves después

Dime qué opción prefieres y procedo.

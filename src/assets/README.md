# 📁 Assets - Wormy PowerFest

Esta carpeta contiene todos los recursos estáticos del proyecto (imágenes, logos, iconos, etc.)

## 📂 Estructura

```
src/assets/
├── images/          # Imágenes generales
├── logos/           # Logos del evento
├── icons/           # Iconos personalizados
└── README.md        # Este archivo
```

## 🖼️ Cómo usar imágenes

### 1. Importar en un componente

```typescript
import logo from '../assets/logos/logo.png';

function MyComponent() {
  return <img src={logo} alt="Logo" />;
}
```

### 2. Usar en CSS/Tailwind

```typescript
<div 
  className="bg-cover bg-center" 
  style={{ backgroundImage: `url(${logo})` }}
>
  Contenido
</div>
```

### 3. Optimización automática

Vite optimiza automáticamente las imágenes importadas:
- Imágenes pequeñas (<4kb) se convierten a base64
- Imágenes grandes se copian a `/dist/assets/` con hash

## 📝 Convenciones de nombres

- `logo.png` - Logo principal
- `logo-white.png` - Logo en blanco
- `banner.jpg` - Banner principal
- `icon-*.svg` - Iconos SVG

## 🎨 Formatos recomendados

- **Logos**: SVG o PNG con transparencia
- **Fotos**: JPG (optimizadas)
- **Iconos**: SVG
- **Fondos**: JPG o WebP

## 📏 Tamaños recomendados

- Logo navbar: 200x50px
- Banner: 1920x600px
- Iconos: 24x24px o 48x48px
- Avatares: 200x200px

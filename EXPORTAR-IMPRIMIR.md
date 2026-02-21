# 📊 Exportar CSV e Imprimir Reporte

## ✅ Funcionalidades Implementadas

### 1. Exportar CSV 📥

Descarga todos los registros en formato CSV (Excel compatible).

**Características:**
- ✅ Formato CSV estándar
- ✅ Compatible con Excel, Google Sheets, Numbers
- ✅ Codificación UTF-8 con BOM (soporta tildes y ñ)
- ✅ Nombre de archivo con fecha: `wormy-powerfest-2024-02-14.csv`

**Columnas incluidas:**
1. ID
2. Nombre
3. Apellido
4. Teléfono
5. Email
6. Deportes (separados por punto y coma)
7. Estado
8. Fecha de Registro
9. Fecha de Check-in

**Ejemplo de contenido:**
```csv
ID,Nombre,Apellido,Teléfono,Email,Deportes,Estado,Fecha de Registro,Fecha de Check-in
"clxxx123","Juan","Pérez","0990900990","juan@test.com","Correr; Gimnasio","Pendiente","14/2/2024, 10:30:00","N/A"
"clyyy456","María","González","0991234567","maria@test.com","Nadar","Registrado","14/2/2024, 11:00:00","15/2/2024, 09:15:00"
```

---

### 2. Imprimir Reporte 🖨️

Genera un reporte HTML profesional listo para imprimir.

**Características:**
- ✅ Diseño profesional con colores del evento
- ✅ Estadísticas en la parte superior
- ✅ Tabla completa de registros
- ✅ Estados con colores (verde, amarillo, rojo)
- ✅ Fecha y hora de generación
- ✅ Optimizado para impresión (márgenes, saltos de página)

**Secciones del reporte:**
1. **Header**: Logo y título del evento
2. **Estadísticas**: Total, Registrados, Pendientes, Deportistas
3. **Tabla de registros**: Todos los datos
4. **Footer**: Información adicional

---

## 🎯 Cómo Usar

### Exportar CSV

1. Ve al Panel de Administración
2. Haz clic en el botón "Exportar CSV"
3. El archivo se descarga automáticamente
4. Abre con Excel, Google Sheets o cualquier editor de hojas de cálculo

### Imprimir Reporte

1. Ve al Panel de Administración
2. Haz clic en el botón "Imprimir Reporte"
3. Se abre una nueva ventana con el reporte
4. Usa Ctrl+P o el botón de imprimir del navegador
5. Selecciona impresora o "Guardar como PDF"

---

## 📁 Archivos Creados

### `src/utils/export.ts`

Contiene todas las funciones de exportación:

```typescript
// Convertir datos a CSV
convertToCSV(data: Attendee[]): string

// Descargar archivo CSV
downloadCSV(data: Attendee[], filename?: string): void

// Generar HTML para imprimir
generatePrintHTML(data: Attendee[], stats: any): string

// Abrir ventana de impresión
printReport(data: Attendee[], stats: any): void
```

---

## 🎨 Diseño del Reporte Impreso

```
┌─────────────────────────────────────────┐
│         🐛 WORMY POWERFEST              │
│         Reporte de Registros            │
│    Generado: 14/2/2024, 10:30:00       │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │Total │ │Regis.│ │Pend. │ │Depor.│  │
│  │ 150  │ │  87  │ │  58  │ │ 142  │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│                                         │
├─────────────────────────────────────────┤
│ ID    │ Nombre │ Tel │ Email │ Estado │
├─────────────────────────────────────────┤
│ clxxx │ Juan P │ 099 │ juan@ │ ✅ Reg │
│ clyyy │ María  │ 099 │ maria │ ⏳ Pen │
│ clzzz │ Carlos │ 099 │ carlo │ ❌ No  │
└─────────────────────────────────────────┘
```

---

## 🔧 Personalización

### Cambiar nombre del archivo CSV

```typescript
// En AdminDashboard.tsx
const filename = `mi-evento-${new Date().toISOString().split('T')[0]}.csv`;
downloadCSV(attendees, filename);
```

### Agregar más columnas al CSV

```typescript
// En src/utils/export.ts
const headers = [
  'ID',
  'Nombre',
  'Apellido',
  'Teléfono',
  'Email',
  'Deportes',
  'Estado',
  'Fecha de Registro',
  'Fecha de Check-in',
  'Nueva Columna' // ← Agregar aquí
];

const rows = data.map((attendee) => [
  attendee.id,
  attendee.firstName,
  attendee.lastName,
  attendee.phone,
  attendee.email,
  attendee.sports.join('; '),
  attendee.status,
  new Date(attendee.registrationDate).toLocaleString('es-EC'),
  attendee.checkInTime ? new Date(attendee.checkInTime).toLocaleString('es-EC') : 'N/A',
  'Valor nuevo' // ← Agregar aquí
]);
```

### Cambiar colores del reporte

```typescript
// En generatePrintHTML()
.header {
  border-bottom: 3px solid #E91E8C; // ← Cambiar color
}

.stat-card {
  border: 2px solid #E91E8C; // ← Cambiar color
}

th {
  background-color: #E91E8C; // ← Cambiar color
}
```

---

## 🧪 Testing

### Test 1: Exportar CSV vacío
```
Acción: Click en "Exportar CSV" sin datos
Resultado: Alerta "No hay datos para exportar"
```

### Test 2: Exportar CSV con datos
```
Acción: Click en "Exportar CSV" con 10 registros
Resultado: 
  ✅ Descarga archivo CSV
  ✅ Nombre: wormy-powerfest-2024-02-14.csv
  ✅ Contiene 11 líneas (1 header + 10 datos)
  ✅ Se abre correctamente en Excel
```

### Test 3: Imprimir reporte
```
Acción: Click en "Imprimir Reporte"
Resultado:
  ✅ Abre nueva ventana
  ✅ Muestra reporte formateado
  ✅ Estadísticas correctas
  ✅ Tabla completa
  ✅ Botón de imprimir funciona
```

### Test 4: Caracteres especiales
```
Datos: Nombre con tildes "José María"
Resultado:
  ✅ CSV muestra correctamente "José María"
  ✅ Reporte muestra correctamente "José María"
```

---

## 📊 Formato de Fechas

### CSV
```
Formato: DD/MM/YYYY, HH:MM:SS
Ejemplo: 14/2/2024, 10:30:00
```

### Reporte Impreso
```
Formato completo: DD/MM/YYYY, HH:MM:SS
Formato hora: HH:MM
```

---

## 🚨 Manejo de Errores

### Sin datos
```javascript
if (attendees.length === 0) {
  alert('No hay datos para exportar');
  return;
}
```

### Ventana emergente bloqueada
```javascript
if (!printWindow) {
  alert('Por favor, permite las ventanas emergentes para imprimir el reporte.');
}
```

---

## 💡 Mejoras Futuras (Opcional)

### Filtros de exportación
```typescript
// Exportar solo registrados
const registrados = attendees.filter(a => a.status === 'Registrado');
downloadCSV(registrados, 'registrados.csv');

// Exportar por deporte
const corredores = attendees.filter(a => a.sports.includes('Correr'));
downloadCSV(corredores, 'corredores.csv');
```

### Exportar a Excel (XLSX)
```bash
npm install xlsx
```

```typescript
import * as XLSX from 'xlsx';

export const downloadExcel = (data: Attendee[]) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Registros');
  XLSX.writeFile(wb, 'registros.xlsx');
};
```

### Enviar reporte por email
```typescript
// Integrar con backend
const sendReportByEmail = async (email: string) => {
  const csv = convertToCSV(attendees);
  await fetch('/api/send-report', {
    method: 'POST',
    body: JSON.stringify({ email, csv })
  });
};
```

---

## ✅ Checklist

- [x] Función convertToCSV implementada
- [x] Función downloadCSV implementada
- [x] Función generatePrintHTML implementada
- [x] Función printReport implementada
- [x] Botón "Exportar CSV" conectado
- [x] Botón "Imprimir Reporte" conectado
- [x] Manejo de errores (sin datos)
- [x] Formato de fechas en español
- [x] Soporte para caracteres especiales (tildes, ñ)
- [x] Diseño profesional del reporte
- [x] Estados deshabilitados cuando no hay datos

---

## 🎯 Resumen

**Exportar CSV:**
- ✅ Descarga archivo CSV
- ✅ Compatible con Excel
- ✅ Todas las columnas incluidas
- ✅ Formato español

**Imprimir Reporte:**
- ✅ Reporte HTML profesional
- ✅ Estadísticas incluidas
- ✅ Tabla completa
- ✅ Listo para imprimir o guardar como PDF

**Ambas funciones están 100% operativas!** 🎉

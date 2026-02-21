import { Attendee } from '../hooks/useEventData';

/**
 * Convierte los datos a formato CSV
 */
export const convertToCSV = (data: Attendee[]): string => {
  if (data.length === 0) return '';

  // Headers
  const headers = [
    'ID',
    'Nombre',
    'Apellido',
    'Teléfono',
    'Email',
    'Deportes',
    'Estado',
    'Fecha de Registro',
    'Fecha de Check-in'
  ];

  // Escape function for CSV (using semicolon as separator)
  const escapeCSV = (value: string): string => {
    // If value contains semicolon, quote, or newline, wrap in quotes and escape quotes
    if (value.includes(';') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Rows
  const rows = data.map((attendee) => {
    const row = [
      escapeCSV(attendee.id),
      escapeCSV(attendee.firstName),
      escapeCSV(attendee.lastName),
      escapeCSV(attendee.phone),
      escapeCSV(attendee.email),
      escapeCSV(attendee.sports.join(', ')), // Changed to comma for better readability
      escapeCSV(attendee.status),
      escapeCSV(new Date(attendee.registrationDate).toLocaleString('es-EC')),
      attendee.checkInTime
        ? escapeCSV(new Date(attendee.checkInTime).toLocaleString('es-EC'))
        : 'N/A'
    ];
    return row.join(';'); // Use semicolon as separator for Excel in Spanish
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(';'), // Use semicolon as separator
    ...rows
  ].join('\r\n');

  return csvContent;
};

/**
 * Descarga un archivo CSV
 */
export const downloadCSV = (data: Attendee[], filename: string = 'registros-warmi-powerfest.csv') => {
  const csv = convertToCSV(data);
  
  // Add BOM for UTF-8 to ensure Excel recognizes special characters
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
};

/**
 * Genera HTML para imprimir
 */
export const generatePrintHTML = (data: Attendee[], stats: any): string => {
  const now = new Date().toLocaleString('es-EC');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reporte Warmi PowerFest</title>
      <style>
        @media print {
          @page {
            margin: 1cm;
          }
        }
        
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #1a1a1a;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #E91E8C;
          padding-bottom: 20px;
        }
        
        .header h1 {
          color: #E91E8C;
          margin: 0;
          font-size: 28px;
        }
        
        .header p {
          color: #666;
          margin: 5px 0;
        }
        
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          border: 2px solid #E91E8C;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        
        .stat-card h3 {
          margin: 0;
          font-size: 14px;
          color: #666;
          text-transform: uppercase;
        }
        
        .stat-card p {
          margin: 10px 0 0 0;
          font-size: 32px;
          font-weight: bold;
          color: #E91E8C;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        th {
          background-color: #E91E8C;
          color: white;
          padding: 12px;
          text-align: left;
          font-size: 12px;
          text-transform: uppercase;
        }
        
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #ddd;
          font-size: 13px;
        }
        
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        
        .status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
        }
        
        .status-registrado {
          background-color: #d4edda;
          color: #155724;
        }
        
        .status-pendiente {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .status-no-llego {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>WARMI POWERFEST</h1>
        <p>Reporte de Registros</p>
        <p>Generado: ${now}</p>
      </div>
      
      <div class="stats">
        <div class="stat-card">
          <h3>Total</h3>
          <p>${stats.total}</p>
        </div>
        <div class="stat-card">
          <h3>Registrados</h3>
          <p>${stats.checkedIn}</p>
        </div>
        <div class="stat-card">
          <h3>Pendientes</h3>
          <p>${stats.pending}</p>
        </div>
        <div class="stat-card">
          <h3>Deportistas</h3>
          <p>${stats.sportsCount}</p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Deportes</th>
            <th>Estado</th>
            <th>Check-in</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((attendee) => `
            <tr>
              <td>${attendee.id}</td>
              <td>${attendee.firstName} ${attendee.lastName}</td>
              <td>${attendee.phone}</td>
              <td>${attendee.email}</td>
              <td>${attendee.sports.join(', ')}</td>
              <td>
                <span class="status status-${
                  attendee.status === 'Registrado' ? 'registrado' :
                  attendee.status === 'Pendiente' ? 'pendiente' : 'no-llego'
                }">
                  ${attendee.status}
                </span>
              </td>
              <td>${
                attendee.checkInTime
                  ? new Date(attendee.checkInTime).toLocaleString('es-EC', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : '-'
              }</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>Warmi PowerFest - Sistema de Registro</p>
        <p>Total de registros: ${data.length}</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Abre ventana de impresión
 */
export const printReport = (data: Attendee[], stats: any) => {
  const html = generatePrintHTML(data, stats);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Esperar a que cargue y luego imprimir
    printWindow.onload = () => {
      printWindow.print();
    };
  } else {
    alert('Por favor, permite las ventanas emergentes para imprimir el reporte.');
  }
};

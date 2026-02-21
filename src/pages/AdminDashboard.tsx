import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Users,
  CheckSquare,
  Clock,
  Dumbbell,
  Download,
  Printer,
  Search } from
'lucide-react';
import { useEventData } from '../hooks/useEventData';
import { FestivalCard } from '../components/ui/FestivalCard';
import { FestivalButton } from '../components/ui/FestivalButton';
import { downloadCSV, printReport } from '../utils/export';
export function AdminDashboard() {
  const { stats, attendees, isLoading, error, refreshData } = useEventData();
  const [searchTerm, setSearchTerm] = useState('');

  // Handle CSV export
  const handleExportCSV = () => {
    if (attendees.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    
    const filename = `warmi-powerfest-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(attendees, filename);
  };

  // Handle print report
  const handlePrintReport = () => {
    if (attendees.length === 0) {
      alert('No hay datos para imprimir');
      return;
    }
    
    printReport(attendees, stats);
  };
  const filteredAttendees = attendees.filter(
    (a) =>
    a.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.phone.includes(searchTerm) ||
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const pieData = [
  {
    name: 'Registrados',
    value: stats.checkedIn,
    color: '#E91E8C'
  },
  {
    name: 'Pendientes',
    value: stats.pending,
    color: '#7C3AED'
  },
  {
    name: 'No Llegaron',
    value: stats.total - stats.checkedIn - stats.pending,
    color: '#FACC15'
  }];

  const StatCard = ({ title, value, icon: Icon, color, delay }: any) =>
  <FestivalCard
    delay={delay}
    className={`border-l-4 border-l-${color} relative overflow-hidden`}>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-4xl font-extrabold text-gray-900 mt-2">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </FestivalCard>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-full text-red-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={refreshData}
              className="text-xs text-red-600 underline mt-1"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-magenta border-t-transparent"></div>
          <p className="text-gray-600 mt-2">Cargando datos...</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Panel Warmi PowerFest
          </h1>
          <p className="text-gray-600">
            Vista en tiempo real de registros y accesos
          </p>
        </div>
        <div className="flex gap-3">
          <FestivalButton
            size="sm"
            variant="secondary"
            className="border-magenta text-magenta hover:bg-magenta/5"
            onClick={handleExportCSV}
            disabled={isLoading || attendees.length === 0}>

            <Download className="w-4 h-4 mr-2" /> Exportar CSV
          </FestivalButton>
          <FestivalButton
            size="sm"
            variant="secondary"
            className="border-violet text-violet hover:bg-violet/5"
            onClick={handlePrintReport}
            disabled={isLoading || attendees.length === 0}>

            <Printer className="w-4 h-4 mr-2" /> Imprimir Reporte
          </FestivalButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Registros"
          value={stats.total}
          icon={Users}
          color="magenta"
          delay={0.1} />

        <StatCard
          title="Registrados"
          value={stats.checkedIn}
          icon={CheckSquare}
          color="violet"
          delay={0.2} />

        <StatCard
          title="Pendientes"
          value={stats.pending}
          icon={Clock}
          color="yellow"
          delay={0.3} />

        <StatCard
          title="Deportistas"
          value={stats.sportsCount}
          icon={Dumbbell}
          color="magenta"
          delay={0.4} />

      </div>

      {/* Charts & Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Donut Chart */}
        <FestivalCard
          className="lg:col-span-1 min-h-[400px] flex flex-col"
          delay={0.5}>

          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Progreso de Acceso
          </h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none">

                  {pieData.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry.color} />
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} />

              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-extrabold text-gray-900">
                {stats.total > 0 ?
                Math.round(stats.checkedIn / stats.total * 100) :
                0}
                %
              </span>
              <span className="text-sm text-gray-500 font-bold uppercase">
                Llegaron
              </span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((item) =>
            <div key={item.name} className="flex items-center gap-2">
                <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: item.color
                }}>
              </div>
                <span className="text-xs font-bold text-gray-600">
                  {item.name}
                </span>
              </div>
            )}
          </div>
        </FestivalCard>

        {/* Recent Activity Timeline */}
        <FestivalCard className="lg:col-span-2" delay={0.6}>
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Escaneos Recientes
          </h3>
          <div className="space-y-6 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            {stats.recentScans.length > 0 ?
            stats.recentScans.map((scan, i) =>
            <motion.div
              key={scan.id}
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: i * 0.05
              }}
              className="flex items-center gap-4 group">

                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-magenta ring-4 ring-magenta/20"></div>
                    {i !== stats.recentScans.length - 1 &&
                <div className="w-0.5 h-10 bg-gray-100 mt-2"></div>
                }
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 flex justify-between items-center group-hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900">
                        {scan.firstName} {scan.lastName}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {scan.sports.map((s) =>
                    <span
                      key={s}
                      className="text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">

                            {s}
                          </span>
                    )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Registrado
                      </span>
                      <p className="text-xs text-gray-400 mt-1 font-mono">
                        {new Date(scan.checkInTime!).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                      </p>
                    </div>
                  </div>
                </motion.div>
            ) :

            <p className="text-gray-500 text-center py-10">
                Sin escaneos recientes.
              </p>
            }
          </div>
        </FestivalCard>
      </div>

      {/* Data Table */}
      <FestivalCard delay={0.7}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-bold text-gray-900">
            Todos los Registros
          </h3>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar asistentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-100 focus:border-violet focus:outline-none transition-colors" />

          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 px-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="py-4 px-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="py-4 px-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Correo
                </th>
                <th className="py-4 px-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Deportes
                </th>
                <th className="py-4 px-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="py-4 px-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Hora de Acceso
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAttendees.map((attendee) =>
              <tr
                key={attendee.id}
                className="hover:bg-gray-50 transition-colors">

                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900">
                      {attendee.firstName} {attendee.lastName}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 font-mono">
                    {attendee.phone}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {attendee.email}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {attendee.sports.map((s) =>
                    <span
                      key={s}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">

                          {s}
                        </span>
                    )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                    className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                      ${attendee.status === 'Registrado' ? 'bg-green-100 text-green-800' : attendee.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}
                    `}>

                      {attendee.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500 font-mono">
                    {attendee.checkInTime ?
                  new Date(attendee.checkInTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) :
                  '-'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {filteredAttendees.length === 0 &&
          <div className="text-center py-10 text-gray-500">
              No se encontraron asistentes con tu búsqueda.
            </div>
          }
        </div>
      </FestivalCard>
    </div>);

}
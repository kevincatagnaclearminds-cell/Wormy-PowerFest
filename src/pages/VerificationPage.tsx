import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw } from
'lucide-react';
import { useEventData, Attendee } from '../hooks/useEventData';
import { FestivalButton } from '../components/ui/FestivalButton';
export function VerificationPage() {
  const { verifyTicket } = useEventData();
  const [ticketId, setTicketId] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'scanning' | 'success' | 'already_used' | 'not_found'>(
    'idle');
  const [scannedData, setScannedData] = useState<Attendee | null>(null);
  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) return;
    
    setStatus('scanning');
    
    try {
      const result = await verifyTicket(ticketId.trim());
      setStatus(result.status);
      if (result.attendee) {
        setScannedData(result.attendee);
      }
    } catch (error) {
      console.error('Error al verificar ticket:', error);
      setStatus('not_found');
    }
  };
  const resetScan = () => {
    setStatus('idle');
    setTicketId('');
    setScannedData(null);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto px-4">
      <AnimatePresence mode="wait">
        {status === 'idle' || status === 'scanning' ?
        <motion.div
          key="scan-input"
          initial={{
            opacity: 0,
            scale: 0.9
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 0.9
          }}
          className="w-full flex flex-col items-center">

            {/* Animated Scan Target */}
            <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
              <motion.div
              animate={{
                scale: [1, 1.05, 1],
                borderColor: ['#E91E8C', '#7C3AED', '#E91E8C']
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="absolute inset-0 border-4 border-magenta rounded-3xl opacity-50" />

              <motion.div
              animate={{
                scale: [1.05, 1, 1.05],
                borderColor: ['#7C3AED', '#FACC15', '#7C3AED']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5
              }}
              className="absolute inset-4 border-4 border-violet rounded-2xl opacity-50" />

              <Scan className="w-24 h-24 text-gray-800 opacity-80" />

              {status === 'scanning' &&
            <motion.div
              initial={{
                height: 0
              }}
              animate={{
                height: '100%'
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
              className="absolute w-full bg-gradient-to-b from-transparent via-magenta/20 to-transparent border-b-2 border-magenta top-0 left-0" />

            }
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {status === 'scanning' ?
            'Verificando Entrada...' :
            'Listo para Escanear'}
            </h2>

            <form onSubmit={handleScan} className="w-full space-y-4">
              <div className="relative">
                <input
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Ingresa el ID de Entrada (ej. FEST-8392)"
                className="w-full px-6 py-4 text-center text-xl font-mono font-bold border-2 border-gray-200 rounded-xl focus:border-violet focus:ring-0 focus:outline-none uppercase placeholder:normal-case placeholder:text-gray-400"
                autoFocus />

              </div>
              <FestivalButton
              type="submit"
              fullWidth
              size="lg"
              disabled={!ticketId || status === 'scanning'}>

                Verificar Entrada
              </FestivalButton>
            </form>
          </motion.div> :

        <motion.div
          key="result"
          initial={{
            opacity: 0,
            y: 50
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            type: 'spring',
            bounce: 0.5
          }}
          className="w-full text-center">

            {status === 'success' &&
          <div className="bg-green-50 border-2 border-green-500 rounded-3xl p-8 shadow-xl">
                <motion.div
              initial={{
                scale: 0
              }}
              animate={{
                scale: 1
              }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">

                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-4xl font-extrabold text-green-600 mb-2">
                  ¡Bienvenido!
                </h2>
                <p className="text-green-800 font-medium mb-6">
                  Entrada Verificada Exitosamente
                </p>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100 mb-8">
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">
                    Asistente
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    {scannedData?.firstName} {scannedData?.lastName}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        Teléfono
                      </p>
                      <p className="font-bold text-gray-800">
                        {scannedData?.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        Deportes
                      </p>
                      <p className="font-bold text-gray-800 truncate">
                        {scannedData?.sports.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          }

            {status === 'already_used' &&
          <div className="bg-amber-50 border-2 border-amber-500 rounded-3xl p-8 shadow-xl">
                <motion.div
              initial={{
                scale: 0
              }}
              animate={{
                scale: 1
              }}
              className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-200">

                  <AlertTriangle className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-3xl font-extrabold text-amber-600 mb-2">
                  ¡Ya Utilizada!
                </h2>
                <p className="text-amber-800 font-medium mb-6">
                  Esta entrada ya fue registrada anteriormente.
                </p>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100 mb-8">
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">
                    Registro Original
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {scannedData?.checkInTime ?
                new Date(scannedData.checkInTime).toLocaleTimeString() :
                'Desconocido'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {scannedData?.checkInTime ?
                new Date(scannedData.checkInTime).toLocaleDateString() :
                ''}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 font-bold uppercase">
                      Titular de la Entrada
                    </p>
                    <p className="font-bold text-gray-900">
                      {scannedData?.firstName} {scannedData?.lastName}
                    </p>
                  </div>
                </div>
              </div>
          }

            {status === 'not_found' &&
          <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-8 shadow-xl">
                <motion.div
              initial={{
                scale: 0,
                rotate: -45
              }}
              animate={{
                scale: 1,
                rotate: 0
              }}
              className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200">

                  <XCircle className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-3xl font-extrabold text-red-600 mb-2">
                  Entrada Inválida
                </h2>
                <p className="text-red-800 font-medium mb-8">
                  El ID de Entrada "{ticketId}" no fue encontrado en el sistema.
                </p>
              </div>
          }

            <div className="mt-8">
              <FestivalButton onClick={resetScan} size="lg" fullWidth>
                <RefreshCw className="w-5 h-5 mr-2" /> Escanear Siguiente
                Entrada
              </FestivalButton>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
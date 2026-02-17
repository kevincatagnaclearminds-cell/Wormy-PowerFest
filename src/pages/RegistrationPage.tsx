import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import confetti from 'canvas-confetti';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult } from
'@hello-pangea/dnd';
import { FestivalButton } from '../components/ui/FestivalButton';
import { FestivalInput } from '../components/ui/FestivalInput';
import { FestivalCard } from '../components/ui/FestivalCard';
import { useEventData } from '../hooks/useEventData';
import { registrationService } from '../services';
import {
  validateEcuadorPhone,
  formatEcuadorPhone,
  validateEmail,
  validateName,
  ERROR_MESSAGES,
} from '../utils/validation';
import {
  User,
  Mail,
  Sparkles,
  RefreshCw,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  GripVertical,
  Dumbbell,
  Edit2,
  Save } from
'lucide-react';
// Sport type definition
type Sport = {
  id: string;
  label: string;
  emoji: string;
  color: string;
};
const AVAILABLE_SPORTS: Sport[] = [
{
  id: 'correr',
  label: 'Correr',
  emoji: '🏃',
  color: 'border-l-magenta'
},
{
  id: 'nadar',
  label: 'Nadar',
  emoji: '🏊',
  color: 'border-l-violet'
},
{
  id: 'gimnasio',
  label: 'Gimnasio',
  emoji: '💪',
  color: 'border-l-yellow'
},
{
  id: 'ninguno',
  label: 'Ninguno',
  emoji: '❌',
  color: 'border-l-gray-400'
}];

export function RegistrationPage() {
  const { addRegistration } = useEventData();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  // Validation Errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  // Drag and Drop State
  const [availableSports, setAvailableSports] =
  useState<Sport[]>(AVAILABLE_SPORTS);
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
  // Submission State
  const [ticketData, setTicketData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [showWhatsAppSent, setShowWhatsAppSent] = useState(false);
  
  // Resend cooldown states
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    email: '',
    phone: ''
  });
  const [editErrors, setEditErrors] = useState({
    email: '',
    phone: ''
  });
  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Resend function (both email and WhatsApp)
  const handleResend = async () => {
    if (resendCooldown > 0 || !ticketData) return;
    
    setIsResending(true);
    
    try {
      // Call API to resend notifications
      const response = await registrationService.resendNotifications(ticketData.id);
      
      if (response.success) {
        setResendCooldown(60); // 60 seconds cooldown
        alert('✅ QR reenviado por correo electrónico y WhatsApp');
      } else {
        throw new Error(response.error || 'Error al reenviar');
      }
    } catch (error) {
      console.error('Error al reenviar:', error);
      alert('❌ Error al reenviar. Por favor, intenta de nuevo.');
    } finally {
      setIsResending(false);
    }
  };

  // Open edit mode
  const handleEditClick = () => {
    setEditData({
      email: ticketData.email,
      phone: ticketData.phone
    });
    setEditErrors({
      email: '',
      phone: ''
    });
    setIsEditMode(true);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditErrors({
      email: '',
      phone: ''
    });
  };

  // Validate edit form
  const validateEditForm = (): boolean => {
    const newErrors = {
      email: '',
      phone: ''
    };

    // Validate phone
    if (!editData.phone.trim()) {
      newErrors.phone = ERROR_MESSAGES.PHONE_REQUIRED;
    } else if (!validateEcuadorPhone(editData.phone)) {
      newErrors.phone = ERROR_MESSAGES.PHONE_INVALID;
    }

    // Validate email
    if (!editData.email.trim()) {
      newErrors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!validateEmail(editData.email)) {
      newErrors.email = ERROR_MESSAGES.EMAIL_INVALID;
    }

    setEditErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  // Save edited data
  const handleSaveEdit = async () => {
    if (!validateEditForm() || !ticketData) return;

    setIsSubmitting(true);

    try {
      // Call API to update data
      const response = await registrationService.updateData(ticketData.id, {
        email: editData.email,
        phone: editData.phone
      });

      if (response.success && response.data) {
        // Update ticket data with response from backend
        setTicketData({
          ...ticketData,
          email: response.data.email,
          phone: response.data.phone,
          updatedAt: response.data.updatedAt
        });

        setIsEditMode(false);
        setResendCooldown(60); // Start cooldown after edit
        
        alert('✅ Datos actualizados. QR reenviado a tu nuevo correo y teléfono.');
      } else {
        throw new Error(response.error || 'Error al actualizar datos');
      }
    } catch (error) {
      console.error('Error al actualizar datos:', error);
      alert('Error al actualizar los datos. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit phone input
  const handleEditPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEcuadorPhone(e.target.value);
    setEditData({ ...editData, phone: formatted });
    
    if (editErrors.phone) {
      setEditErrors({ ...editErrors, phone: '' });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    };

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = ERROR_MESSAGES.NAME_REQUIRED;
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName = ERROR_MESSAGES.NAME_INVALID;
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = ERROR_MESSAGES.NAME_REQUIRED;
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName = ERROR_MESSAGES.NAME_INVALID;
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = ERROR_MESSAGES.PHONE_REQUIRED;
    } else if (!validateEcuadorPhone(formData.phone)) {
      newErrors.phone = ERROR_MESSAGES.PHONE_INVALID;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = ERROR_MESSAGES.EMAIL_INVALID;
    }

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error !== '');
  };

  // Handle phone input with formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEcuadorPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
    
    // Clear error when user starts typing
    if (errors.phone) {
      setErrors({ ...errors, phone: '' });
    }
  };

  // Handle drag end
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    // Dropped outside the list
    if (!destination) return;
    // Reordering within the same list
    if (source.droppableId === destination.droppableId) {
      const items =
      source.droppableId === 'available-sports' ?
      Array.from(availableSports) :
      Array.from(selectedSports);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      if (source.droppableId === 'available-sports') {
        setAvailableSports(items);
      } else {
        setSelectedSports(items);
      }
      return;
    }
    // Moving from available to selected
    if (
    source.droppableId === 'available-sports' &&
    destination.droppableId === 'selected-sports')
    {
      const sourceItems = Array.from(availableSports);
      const destItems = Array.from(selectedSports);
      const [movedItem] = sourceItems.splice(source.index, 1);
      // Logic for "Ninguno"
      if (movedItem.id === 'ninguno') {
        // If "Ninguno" is selected, clear all other selections and move them back to available
        const allSelected = [...destItems];
        setAvailableSports([...sourceItems, ...allSelected]);
        setSelectedSports([movedItem]);
      } else {
        // If a sport is selected, remove "Ninguno" from selected if present
        const noneIndex = destItems.findIndex((item) => item.id === 'ninguno');
        if (noneIndex > -1) {
          const [noneItem] = destItems.splice(noneIndex, 1);
          sourceItems.push(noneItem);
        }
        destItems.splice(destination.index, 0, movedItem);
        setAvailableSports(sourceItems);
        setSelectedSports(destItems);
      }
    }
    // Moving from selected to available (removing)
    if (
    source.droppableId === 'selected-sports' &&
    destination.droppableId === 'available-sports')
    {
      const sourceItems = Array.from(selectedSports);
      const destItems = Array.from(availableSports);
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);
      setSelectedSports(sourceItems);
      setAvailableSports(destItems);
    }
  };
  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const sportsLabels = selectedSports.map((s) => s.label);
      const newTicket = await addRegistration(
        formData.firstName,
        formData.lastName,
        formData.phone,
        formData.email,
        sportsLabels
      );
      
      setTicketData(newTicket);
      setStep(3);
      
      // Trigger confetti
      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: {
            x: 0
          },
          colors: ['#E91E8C', '#7C3AED', '#FACC15']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: {
            x: 1
          },
          colors: ['#E91E8C', '#7C3AED', '#FACC15']
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
      
      // Simulate sending notifications
      setTimeout(() => setShowEmailSent(true), 1000);
      setTimeout(() => setShowWhatsAppSent(true), 2000);
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error al crear el registro. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    });
    setErrors({
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    });
    setAvailableSports(AVAILABLE_SPORTS);
    setSelectedSports([]);
    setStep(1);
    setTicketData(null);
    setShowEmailSent(false);
    setShowWhatsAppSent(false);
    setResendCooldown(0);
  };
  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setStep(2);
    }
  };
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Progress Indicator */}
      <div className="flex justify-center mb-8 gap-3">
        {[1, 2, 3].map((s) =>
        <div
          key={s}
          className={`w-3 h-3 rounded-full transition-colors duration-300 ${step >= s ? 'bg-magenta' : 'bg-gray-200'}`} />

        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 &&
        <motion.div
          key="step1"
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: 20
          }}
          transition={{
            duration: 0.3
          }}>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Regístrate en Wormy PowerFest
              </h1>
              <p className="text-lg text-gray-600">
                ¡El evento deportivo más divertido del año!
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Los datos que ingreses serán utilizados para generar tu QR de entrada que te llegará al correo y teléfono.
              </p>
            </div>

            <FestivalCard className="border-t-4 border-t-magenta shadow-xl">
              <form onSubmit={nextStep} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FestivalInput
                  label="Nombre"
                  placeholder="ej. Alex"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      firstName: e.target.value
                    });
                    if (errors.firstName) {
                      setErrors({ ...errors, firstName: '' });
                    }
                  }}
                  error={errors.firstName}
                  required />

                  <FestivalInput
                  label="Apellido"
                  placeholder="ej. Rivera"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      lastName: e.target.value
                    });
                    if (errors.lastName) {
                      setErrors({ ...errors, lastName: '' });
                    }
                  }}
                  error={errors.lastName}
                  required />

                </div>

                <div>
                  <FestivalInput
                  label="Teléfono"
                  type="tel"
                  placeholder="0990900990"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  error={errors.phone}
                  maxLength={10}
                  required />
                  {!errors.phone && (
                    <p className="text-xs text-gray-500 mt-1 ml-1">
                      Ingresa 10 dígitos, empezando con 09
                    </p>
                  )}
                </div>


                <FestivalInput
                label="Correo Electrónico"
                type="email"
                placeholder="alex@ejemplo.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    email: e.target.value
                  });
                  if (errors.email) {
                    setErrors({ ...errors, email: '' });
                  }
                }}
                error={errors.email}
                required />


                <div className="pt-4 flex justify-end">
                  <FestivalButton type="submit" size="lg">
                    Siguiente <ArrowRight className="w-5 h-5 ml-2" />
                  </FestivalButton>
                </div>
              </form>
            </FestivalCard>
          </motion.div>
        }

        {step === 2 &&
        <motion.div
          key="step2"
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: -20
          }}
          transition={{
            duration: 0.3
          }}>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                ¿Cuáles son tus deportes favoritos?
              </h1>
              <p className="text-lg text-gray-600">
                Arrastra los deportes que te gustan al área de selección
              </p>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Available Sports */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-500 uppercase text-sm tracking-wider mb-4">
                    Deportes Disponibles
                  </h3>
                  <Droppable droppableId="available-sports">
                    {(provided, snapshot) =>
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`
                          min-h-[300px] p-4 rounded-2xl border-2 border-dashed transition-colors duration-200
                          ${snapshot.isDraggingOver ? 'border-magenta bg-magenta/5' : 'border-gray-200 bg-gray-50'}
                        `}>

                        {availableSports.map((sport, index) =>
                    <Draggable
                      key={sport.id}
                      draggableId={sport.id}
                      index={index}>

                            {(provided, snapshot) =>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`
                                  bg-white p-4 mb-3 rounded-xl shadow-sm border-l-4 ${sport.color}
                                  flex items-center gap-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all
                                  ${snapshot.isDragging ? 'scale-105 shadow-xl rotate-2 z-50' : ''}
                                `}
                        style={provided.draggableProps.style}>

                                <span className="text-2xl">{sport.emoji}</span>
                                <span className="font-bold text-gray-800">
                                  {sport.label}
                                </span>
                                <GripVertical className="ml-auto text-gray-300 w-5 h-5" />
                              </div>
                      }
                          </Draggable>
                    )}
                        {provided.placeholder}
                      </div>
                  }
                  </Droppable>
                </div>

                {/* Selected Sports */}
                <div className="space-y-4">
                  <h3 className="font-bold text-magenta uppercase text-sm tracking-wider mb-4">
                    Tu Selección
                  </h3>
                  <Droppable droppableId="selected-sports">
                    {(provided, snapshot) =>
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`
                          min-h-[300px] p-4 rounded-2xl border-2 transition-colors duration-200 relative
                          ${snapshot.isDraggingOver ? 'border-violet bg-violet/5' : 'border-violet/30 bg-white'}
                        `}>

                        {selectedSports.length === 0 &&
                    !snapshot.isDraggingOver &&
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                              <Dumbbell className="w-12 h-12 mb-2 opacity-20" />
                              <p className="text-sm font-medium">
                                Suelta aquí tus deportes favoritos
                              </p>
                            </div>
                    }

                        {selectedSports.map((sport, index) =>
                    <Draggable
                      key={sport.id}
                      draggableId={sport.id}
                      index={index}>

                            {(provided, snapshot) =>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`
                                  bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100
                                  flex items-center gap-3 cursor-grab active:cursor-grabbing
                                  ${snapshot.isDragging ? 'scale-105 shadow-xl rotate-2 z-50' : ''}
                                `}
                        style={provided.draggableProps.style}>

                                <span className="text-2xl">{sport.emoji}</span>
                                <span className="font-bold text-gray-800">
                                  {sport.label}
                                </span>
                                <GripVertical className="ml-auto text-gray-300 w-5 h-5" />
                              </div>
                      }
                          </Draggable>
                    )}
                        {provided.placeholder}
                      </div>
                  }
                  </Droppable>
                </div>
              </div>
            </DragDropContext>

            <div className="pt-8 flex justify-between items-center">
              <FestivalButton
              variant="ghost"
              onClick={() => setStep(1)}
              disabled={isSubmitting}>

                <ArrowLeft className="w-5 h-5 mr-2" /> Volver
              </FestivalButton>

              <FestivalButton
              onClick={handleSubmit}
              size="lg"
              isLoading={isSubmitting}
              disabled={selectedSports.length === 0}>

                {isSubmitting ? 'Generando...' : 'Completar Registro'}{' '}
                <Sparkles className="w-5 h-5 ml-2" />
              </FestivalButton>
            </div>
          </motion.div>
        }

        {step === 3 && ticketData &&
        <motion.div
          key="step3"
          initial={{
            opacity: 0,
            scale: 0.9
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            type: 'spring',
            duration: 0.6
          }}
          className="flex flex-col items-center">

            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                ¡Estás Dentro! 🎟️
              </h2>
              <p className="text-gray-600">
                Tu entrada fue enviada a tu correo y teléfono.
              </p>
            </div>

            {/* Ticket Stub Design */}
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden relative mb-8">
              {/* Top Section (Event Info) */}
              <div className="bg-gradient-to-r from-magenta to-violet p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-yellow/30 rounded-full blur-xl"></div>

                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3 backdrop-blur-sm border border-white/30">
                    ENTRADA OFICIAL
                  </span>
                  <h3 className="text-2xl font-extrabold mb-1 flex items-center gap-2">
                    <Dumbbell className="w-6 h-6" /> WORMY POWERFEST
                  </h3>
                  <p className="text-white/80 text-sm font-medium">
                    Válido para una entrada
                  </p>
                </div>
              </div>

              {/* Main Content - Two Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Left Column - Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-magenta flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        Asistente
                      </p>
                      <p className="font-bold text-gray-900">
                        {ticketData.firstName} {ticketData.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-violet flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        Teléfono
                      </p>
                      <p className="font-bold text-gray-900">
                        {ticketData.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-yellow flex-shrink-0">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        Deportes
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ticketData.sports.map((sport: string) =>
                      <span
                        key={sport}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">

                            {sport}
                          </span>
                      )}
                      </div>
                    </div>
                  </div>

                  {/* Edit Button - Bottom Left */}
                  <div className="pt-4 mt-auto">
                    <button
                      onClick={handleEditClick}
                      className="text-sm font-medium text-magenta hover:text-violet transition-colors flex items-center gap-2 underline"
                    >
                      <Mail className="w-4 h-4" />
                      Editar Datos
                    </button>
                  </div>
                </div>

                {/* Right Column - QR Code */}
                <div className="flex flex-col items-center justify-center border-l-2 border-dashed border-gray-200 pl-6">
                  <div className="bg-white p-4 rounded-xl border-4 border-gray-900 shadow-sm">
                    <QRCode
                    value={ticketData.id}
                    size={180}
                    level="H"
                    fgColor="#1a1a1a" />

                  </div>
                  <p className="mt-4 text-xs text-gray-400 font-mono text-center">
                    ID: {ticketData.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Sending Status */}
            <div className="w-full max-w-4xl space-y-3 mb-8">
              <AnimatePresence>
                {(showEmailSent || showWhatsAppSent) &&
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                className="bg-green-50 border border-green-200 rounded-lg p-4">

                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800 mb-1">
                          QR enviado por correo electrónico a {ticketData.email}
                        </p>
                        <p className="text-sm font-medium text-green-800">
                          QR enviado por WhatsApp a {ticketData.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-9">
                      <button
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || isResending}
                        className={`text-sm font-medium transition-colors ${
                          resendCooldown > 0 || isResending
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-green-700 hover:text-green-900 underline'
                        }`}
                      >
                        {isResending
                          ? 'Reenviando...'
                          : resendCooldown > 0
                          ? `Reenviar en ${resendCooldown}s`
                          : '¿No te llegó? Reenviar'}
                      </button>
                    </div>
                  </motion.div>
              }
              </AnimatePresence>
            </div>

            <div>
              <FestivalButton variant="secondary" onClick={resetForm}>
                <RefreshCw className="w-4 h-4 mr-2" /> Registrar Otra Persona
              </FestivalButton>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditMode && ticketData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                Editar Datos
              </h3>
              <p className="text-gray-600 mb-6">
                Actualiza tu correo o teléfono. Se reenviará el QR automáticamente.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <FestivalInput
                    label="Correo Electrónico"
                    type="email"
                    placeholder="alex@ejemplo.com"
                    value={editData.email}
                    onChange={(e) => {
                      setEditData({ ...editData, email: e.target.value });
                      if (editErrors.email) {
                        setEditErrors({ ...editErrors, email: '' });
                      }
                    }}
                    error={editErrors.email}
                    required
                  />
                </div>

                <div>
                  <FestivalInput
                    label="Teléfono"
                    type="tel"
                    placeholder="0990900990"
                    value={editData.phone}
                    onChange={handleEditPhoneChange}
                    error={editErrors.phone}
                    maxLength={10}
                    required
                  />
                  {!editErrors.phone && (
                    <p className="text-xs text-gray-500 mt-1 ml-1">
                      Ingresa 10 dígitos, empezando con 09
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <FestivalButton
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  fullWidth
                >
                  Cancelar
                </FestivalButton>
                <FestivalButton
                  onClick={handleSaveEdit}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  fullWidth
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar y Reenviar'}
                </FestivalButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>);

}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FestivalButton } from '../components/ui/FestivalButton';
import { FestivalInput } from '../components/ui/FestivalInput';
import { FestivalCard } from '../components/ui/FestivalCard';
import { EmailInput } from '../components/ui/EmailInput';
import { useEventData } from '../hooks/useEventData';
import { registrationService } from '../services';
import {
  validateEcuadorPhone,
  formatEcuadorPhone,
  validateEmail,
  validateName,
  validateEcuadorCedula,
  formatEcuadorCedula,
  validateEdad,
  validateSector,
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
  Dumbbell
} from
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
    id: 'baile',
    label: 'Baile',
    emoji: '💃',
    color: 'border-l-red'
  },
  {
    id: 'futbol',
    label: 'Futbol',
    emoji: '⚽',
    color: 'border-l-blue'
  },
  {
    id: 'basket',
    label: 'Basket',
    emoji: '🏀',
    color: 'border-l-orange'
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
    emailUsername: '',
    emailDomain: '@gmail.com',
    cedula: '',
    edad: '',
    sector: ''
  });
  // Validation Errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    cedula: '',
    edad: '',
    sector: ''
  });
  // Sports selection state
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  // Submission State
  const [ticketData, setTicketData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);

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

  // Alternative email modal state
  const [showAltEmailModal, setShowAltEmailModal] = useState(false);
  const [altEmail, setAltEmail] = useState('');
  const [altEmailError, setAltEmailError] = useState('');
  const [isSendingAltEmail, setIsSendingAltEmail] = useState(false);
  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Open alternative email modal
  const handleOpenAltEmailModal = () => {
    setAltEmail('');
    setAltEmailError('');
    setShowAltEmailModal(true);
  };

  // Send QR to alternative email
  const handleSendAltEmail = async () => {
    if (!altEmail.trim()) {
      setAltEmailError(ERROR_MESSAGES.EMAIL_REQUIRED);
      return;
    }
    if (!validateEmail(altEmail)) {
      setAltEmailError(ERROR_MESSAGES.EMAIL_INVALID);
      return;
    }

    setIsSendingAltEmail(true);
    try {
      // Call backend to send to alternative email
      const response = await registrationService.sendAltEmail(ticketData.id, altEmail);

      if (response.success) {
        alert('✅ QR enviado al correo alternativo exitosamente');
        setShowAltEmailModal(false);
      } else {
        throw new Error(response.error || 'Error al enviar email');
      }
    } catch (error) {
      console.error('Error al enviar email alternativo:', error);
      alert('❌ Error al enviar email. Por favor, intenta de nuevo.');
    } finally {
      setIsSendingAltEmail(false);
    }
  };

  // Resend function
  const handleResend = async () => {
    if (resendCooldown > 0 || !ticketData) return;

    setIsResending(true);

    try {
      // Call API to resend notifications
      const response = await registrationService.resendNotifications(ticketData.id);

      if (response.success) {
        setResendCooldown(60); // 60 seconds cooldown
        alert('✅ QR reenviado por correo electrónico');
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

        alert('✅ Datos actualizados. QR reenviado a tu nuevo correo.');
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
      email: '',
      cedula: '',
      edad: '',
      sector: ''
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

    // Validate email (username + domain)
    const fullEmail = formData.emailUsername + formData.emailDomain;
    if (!formData.emailUsername.trim()) {
      newErrors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!validateEmail(fullEmail)) {
      newErrors.email = ERROR_MESSAGES.EMAIL_INVALID;
    }

    // Validate cedula (obligatorio)
    if (!formData.cedula.trim()) {
      newErrors.cedula = ERROR_MESSAGES.CEDULA_REQUIRED || 'La cédula es requerida';
    } else if (!validateEcuadorCedula(formData.cedula)) {
      newErrors.cedula = ERROR_MESSAGES.CEDULA_INVALID;
    }

    // Validate edad (obligatorio)
    if (!formData.edad.trim()) {
      newErrors.edad = ERROR_MESSAGES.EDAD_REQUIRED || 'La edad es requerida';
    } else {
      const edadNum = parseInt(formData.edad);
      if (isNaN(edadNum) || !validateEdad(edadNum)) {
        newErrors.edad = ERROR_MESSAGES.EDAD_INVALID;
      }
    }

    // Validate sector (obligatorio)
    if (!formData.sector.trim()) {
      newErrors.sector = ERROR_MESSAGES.SECTOR_REQUIRED || 'El sector es requerido';
    } else if (!validateSector(formData.sector)) {
      newErrors.sector = ERROR_MESSAGES.SECTOR_TOO_LONG;
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

  // Handle cedula input with formatting
  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEcuadorCedula(e.target.value);
    setFormData({ ...formData, cedula: formatted });

    // Clear error when user starts typing
    if (errors.cedula) {
      setErrors({ ...errors, cedula: '' });
    }
  };

  // Handle sport selection with checkbox
  const handleSportToggle = (sportId: string) => {
    if (sportId === 'ninguno') {
      // If "Ninguno" is selected, clear all other selections
      if (selectedSports.includes('ninguno')) {
        setSelectedSports([]);
      } else {
        setSelectedSports(['ninguno']);
      }
    } else {
      // If selecting a sport
      if (selectedSports.includes(sportId)) {
        // Deselect the sport
        setSelectedSports(selectedSports.filter(id => id !== sportId));
      } else {
        // Check if limit of 3 sports is reached
        if (selectedSports.length >= 3 && !selectedSports.includes('ninguno')) {
          return;
        }
        // Remove "Ninguno" if present and add the new sport
        const newSelection = selectedSports.filter(id => id !== 'ninguno');
        setSelectedSports([...newSelection, sportId]);
      }
    }
  };
  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const sportsLabels = selectedSports.length > 0 
        ? selectedSports.map(id => AVAILABLE_SPORTS.find(s => s.id === id)?.label || '')
        : [];
      const fullEmail = formData.emailUsername + formData.emailDomain;
      
      const newTicket = await addRegistration(
        formData.firstName,
        formData.lastName,
        formData.phone,
        fullEmail,
        sportsLabels,
        formData.cedula,
        parseInt(formData.edad),
        formData.sector
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

      // Show email sent notification
      setTimeout(() => setShowEmailSent(true), 1000);
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
      emailUsername: '',
      emailDomain: '@gmail.com',
      cedula: '',
      edad: '',
      sector: ''
    });
    setErrors({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      cedula: '',
      edad: '',
      sector: ''
    });
    setSelectedSports([]);
    setStep(1);
    setTicketData(null);
    setShowEmailSent(false);
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
                Regístrate en Warmi PowerFest
              </h1>
              <p className="text-lg text-gray-600">
                ¡El evento más inspirador del año!
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Asegúrate de ingresar información verificada; recibirás tu código QR de acceso directamente en tu correo electrónico, preséntalo al ingresar al evento y recibir tu Pasaporte Warmi y participa por increíbles premios.
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

                <EmailInput
                  label="Correo Electrónico"
                  username={formData.emailUsername}
                  domain={formData.emailDomain}
                  onUsernameChange={(value) => {
                    setFormData({ ...formData, emailUsername: value });
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  onDomainChange={(value) => {
                    setFormData({ ...formData, emailDomain: value });
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  error={errors.email}
                  required
                />

                <div>
                  <FestivalInput
                    label="Cédula"
                    type="text"
                    placeholder="1234567890"
                    value={formData.cedula}
                    onChange={handleCedulaChange}
                    error={errors.cedula}
                    maxLength={10}
                    required
                  />
                  {!errors.cedula && (
                    <p className="text-xs text-gray-500 mt-1 ml-1">
                      Ingresa 10 dígitos de tu cédula ecuatoriana
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FestivalInput
                      label="Edad"
                      type="number"
                      placeholder="25"
                      value={formData.edad}
                      onChange={(e) => {
                        setFormData({ ...formData, edad: e.target.value });
                        if (errors.edad) {
                          setErrors({ ...errors, edad: '' });
                        }
                      }}
                      error={errors.edad}
                      min={5}
                      max={120}
                      required
                    />
                    {!errors.edad && (
                      <p className="text-xs text-gray-500 mt-1 ml-1">
                        Entre 5 y 120 años
                      </p>
                    )}
                  </div>

                  <div>
                    <FestivalInput
                      label="Sector donde vive"
                      type="text"
                      placeholder="ej. Norte, Centro, Sur"
                      value={formData.sector}
                      onChange={(e) => {
                        setFormData({ ...formData, sector: e.target.value });
                        if (errors.sector) {
                          setErrors({ ...errors, sector: '' });
                        }
                      }}
                      error={errors.sector}
                      maxLength={100}
                      required
                    />
                    {!errors.sector && (
                      <p className="text-xs text-gray-500 mt-1 ml-1">
                        {formData.sector.length}/100 caracteres
                      </p>
                    )}
                  </div>
                </div>


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
                Selecciona hasta 3 deportes (opcional)
              </p>
              {selectedSports.length > 0 && !selectedSports.includes('ninguno') && (
                <p className="text-sm text-magenta font-medium mt-2">
                  {selectedSports.length}/3 deportes seleccionados
                </p>
              )}
            </div>

            <FestivalCard className="border-t-4 border-t-violet shadow-xl">
              <div className="space-y-3">
                {AVAILABLE_SPORTS.map((sport) => {
                  const isSelected = selectedSports.includes(sport.id);
                  const isNinguno = sport.id === 'ninguno';
                  const isDisabled = 
                    (isNinguno && selectedSports.length > 0 && !isSelected) ||
                    (!isNinguno && selectedSports.includes('ninguno')) ||
                    (!isSelected && selectedSports.length >= 3 && !selectedSports.includes('ninguno'));

                  return (
                    <label
                      key={sport.id}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border-l-4 ${sport.color}
                        transition-all cursor-pointer
                        ${isSelected 
                          ? 'bg-gradient-to-r from-magenta/5 to-violet/5 border-2 border-magenta shadow-md' 
                          : 'bg-white border border-gray-200 hover:shadow-md'
                        }
                        ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => !isDisabled && handleSportToggle(sport.id)}
                        disabled={isDisabled}
                        className="w-5 h-5 text-magenta rounded border-gray-300 focus:ring-magenta focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="text-2xl">{sport.emoji}</span>
                      <span className={`font-bold ${isSelected ? 'text-magenta' : 'text-gray-800'}`}>
                        {sport.label}
                      </span>
                      {isDisabled && !isSelected && (
                        <span className="ml-auto text-xs text-gray-400 font-medium">
                          {isNinguno ? 'Bloqueado' : selectedSports.includes('ninguno') ? 'Bloqueado' : 'Límite alcanzado'}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </FestivalCard>

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
                isLoading={isSubmitting}>

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
                    <Dumbbell className="w-6 h-6" /> WARMI POWERFEST
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

                {/* Right Column - Email Confirmation Message */}
                <div className="flex flex-col items-center justify-center border-l-2 border-dashed border-gray-200 pl-6">
                  <div className="bg-gradient-to-br from-magenta/10 to-violet/10 p-8 rounded-xl border-2 border-magenta/20">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-magenta to-violet rounded-full flex items-center justify-center">
                        <Mail className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        ¡QR Enviado!
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Tu código QR ha sido enviado a tu correo electrónico
                      </p>
                      <p className="text-magenta font-bold text-sm mt-2">
                        {ticketData.email}
                      </p>
                    </div>
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
                {showEmailSent &&
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

                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">
                          QR enviado por correo electrónico a {ticketData.email}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="ml-9 space-y-2">
                      <button
                        onClick={handleOpenAltEmailModal}
                        className="text-sm font-medium text-magenta hover:text-magenta/80 underline transition-colors flex items-center gap-1"
                      >
                        <Mail className="w-4 h-4" />
                        Enviar por otro correo
                      </button>

                      <button
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || isResending}
                        className={`text-sm font-medium transition-colors ${resendCooldown > 0 || isResending
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-green-700 hover:text-green-900 underline'
                          }`}
                      >
                        {isResending
                          ? 'Reenviando...'
                          : resendCooldown > 0
                            ? `Reenviar en ${resendCooldown}s`
                            : '¿No te llegó? Reenviar al correo'}
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
                Actualiza tu correo o teléfono. Se reenviará el QR a tu correo.
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

      {/* Alternative Email Modal */}
      <AnimatePresence>
        {showAltEmailModal && ticketData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAltEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-magenta/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-magenta" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900">
                    Enviar por otro correo
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ingresa el correo alternativo
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <FestivalInput
                    label="Correo Electrónico"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={altEmail}
                    onChange={(e) => {
                      setAltEmail(e.target.value);
                      if (altEmailError) {
                        setAltEmailError('');
                      }
                    }}
                    error={altEmailError}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <FestivalButton
                  variant="ghost"
                  onClick={() => setShowAltEmailModal(false)}
                  disabled={isSendingAltEmail}
                  fullWidth
                >
                  Cancelar
                </FestivalButton>
                <FestivalButton
                  onClick={handleSendAltEmail}
                  isLoading={isSendingAltEmail}
                  disabled={isSendingAltEmail}
                  fullWidth
                >
                  {isSendingAltEmail ? 'Enviando...' : 'Enviar QR'}
                </FestivalButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>);

}

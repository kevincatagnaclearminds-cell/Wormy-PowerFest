import { useState, useEffect } from 'react';
import { registrationService, verificationService, statsService } from '../services';

export type CheckInStatus = 'Registrado' | 'Pendiente' | 'No llegó';

export interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  sports: string[];
  status: CheckInStatus;
  checkInTime?: string;
  registrationDate: string;
}

export interface EventStats {
  total: number;
  checkedIn: number;
  pending: number;
  sportsCount: number;
  recentScans: Attendee[];
}

// Map backend status to frontend status
const mapStatus = (status: string): CheckInStatus => {
  switch (status) {
    case 'CHECKED_IN':
      return 'Registrado';
    case 'PENDING':
      return 'Pendiente';
    case 'NO_SHOW':
      return 'No llegó';
    default:
      return 'Pendiente';
  }
};

// Map frontend status to backend status
const mapStatusToBackend = (status: CheckInStatus): string => {
  switch (status) {
    case 'Registrado':
      return 'CHECKED_IN';
    case 'Pendiente':
      return 'PENDING';
    case 'No llegó':
      return 'NO_SHOW';
    default:
      return 'PENDING';
  }
};

export function useEventData() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [stats, setStats] = useState<EventStats>({
    total: 0,
    checkedIn: 0,
    pending: 0,
    sportsCount: 0,
    recentScans: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all registrations
  const fetchAttendees = async () => {
    setIsLoading(true);
    setError(null);

    const response = await registrationService.getAll();

    if (response.success && response.data) {
      const mappedAttendees = response.data.map((reg) => ({
        id: reg.id,
        firstName: reg.firstName,
        lastName: reg.lastName,
        phone: reg.phone,
        email: reg.email,
        sports: reg.sports,
        status: mapStatus(reg.status),
        checkInTime: reg.checkInTime || undefined,
        registrationDate: reg.registrationDate,
      }));
      setAttendees(mappedAttendees);
    } else {
      setError(response.error || 'Error al cargar registros');
    }

    setIsLoading(false);
  };

  // Fetch stats
  const fetchStats = async () => {
    const response = await statsService.getStats();

    if (response.success && response.data) {
      const mappedScans = response.data.recentScans.map((scan) => ({
        id: scan.id,
        firstName: scan.firstName,
        lastName: scan.lastName,
        phone: '',
        email: '',
        sports: scan.sports,
        status: 'Registrado' as CheckInStatus,
        checkInTime: scan.checkInTime,
        registrationDate: scan.checkInTime,
      }));

      setStats({
        total: response.data.total,
        checkedIn: response.data.checkedIn,
        pending: response.data.pending,
        sportsCount: response.data.sportsCount,
        recentScans: mappedScans,
      });
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchAttendees();
    fetchStats();
  }, []);

  // Add registration
  const addRegistration = async (
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  sports: string[],
  cedula: string,
  edad: number,
  sector: string
) => {
  const response = await registrationService.create({
    firstName,
    lastName,
    phone,
    email,
    sports,
    cedula,
    edad,
    sector
  });

    if (response.success && response.data) {
      const newAttendee: Attendee = {
        id: response.data.id,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phone: response.data.phone,
        email: response.data.email,
        sports: response.data.sports,
        status: mapStatus(response.data.status),
        checkInTime: response.data.checkInTime || undefined,
        registrationDate: response.data.registrationDate,
      };

      setAttendees((prev) => [newAttendee, ...prev]);
      fetchStats(); // Update stats

      return newAttendee;
    } else {
      throw new Error(response.error || 'Error al crear registro');
    }
  };

  // Verify ticket
  const verifyTicket = async (
    ticketId: string
  ): Promise<{
    status: 'success' | 'already_used' | 'not_found';
    attendee?: Attendee;
  }> => {
    const response = await verificationService.verifyTicket(ticketId);

    if (response.success && response.data) {
      const { status, data } = response.data;

      if (data) {
        const attendee: Attendee = {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          sports: data.sports,
          status: mapStatus(data.status),
          checkInTime: data.checkInTime || undefined,
          registrationDate: data.registrationDate,
        };

        // Update local state
        setAttendees((prev) =>
          prev.map((a) => (a.id === ticketId ? attendee : a))
        );

        fetchStats(); // Update stats

        return { status, attendee };
      }

      return { status };
    } else {
      return { status: 'not_found' };
    }
  };

  return {
    attendees,
    stats,
    isLoading,
    error,
    addRegistration,
    verifyTicket,
    refreshData: () => {
      fetchAttendees();
      fetchStats();
    },
  };
}
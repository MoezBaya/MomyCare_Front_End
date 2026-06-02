import { useEffect, useMemo, useState } from "react";
import {
  loadDoctorAgendaData,
  addDoctorAvailability,
  deleteDoctorAvailability,
} from "@/services/agendaService";
import {
  mapAppointmentToCalendarEvent,
  mapAvailabilityToCalendarEvent,
} from "@/adapters/agendaAdapter";
import { useToast } from "@/hooks/useToast";

export function useDoctorAgenda() {
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("calendar");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const { toasts, notify, dismissToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const data = await loadDoctorAgendaData();
        if (!isMounted) return;
        setDoctorProfile(data.profile);
        setAppointments(data.appointments || []);
        setAvailabilities(data.availabilities || []);
      } catch (err) {
        if (!isMounted) return;
        setError("Impossible de charger l'agenda.");
        notify("Erreur de chargement de l'agenda", "error");
        console.error("[useDoctorAgenda]", err?.message || err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [notify]);

  const events = useMemo(
    () => [
      ...availabilities.map((slot) => mapAvailabilityToCalendarEvent(slot)),
      ...appointments.map((appointment) => mapAppointmentToCalendarEvent(appointment)),
    ],
    [availabilities, appointments]
  );

  const handleAddAvailability = async (dateTime) => {
    if (!doctorProfile?.id || !dateTime) {
      notify("Veuillez sélectionner une date et une heure valides.", "error");
      return [];
    }

    setIsSaving(true);
    try {
      const created = await addDoctorAvailability(doctorProfile.id, dateTime);
      setAvailabilities((prev) => [...created, ...prev]);
      notify("Créneau ajouté avec succès.", "success");
      return created;
    } catch (err) {
      notify("Impossible d'ajouter le créneau.", "error");
      console.error("[useDoctorAgenda] addAvailability", err?.message || err);
      return [];
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAvailability = async (availabilityId) => {
    if (!doctorProfile?.id || !availabilityId) {
      return;
    }

    setIsSaving(true);
    try {
      await deleteDoctorAvailability(availabilityId, doctorProfile.id);
      setAvailabilities((prev) => prev.filter((slot) => String(slot.id) !== String(availabilityId)));
      notify("Créneau supprimé.", "success");
    } catch (err) {
      notify("Impossible de supprimer le créneau.", "error");
      console.error("[useDoctorAgenda] deleteAvailability", err?.message || err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
  };

  const refreshAgenda = async () => {
    setIsLoading(true);
    try {
      const data = await loadDoctorAgendaData();
      setDoctorProfile(data.profile);
      setAppointments(data.appointments || []);
      setAvailabilities(data.availabilities || []);
      notify("Agenda mis à jour.", "success");
    } catch (err) {
      setError("Impossible de rafraîchir l'agenda.");
      notify("Erreur lors de la mise à jour de l'agenda", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    doctorProfile,
    appointments,
    availabilities,
    selectedEvent,
    activeTab,
    setActiveTab,
    events,
    isLoading,
    isSaving,
    error,
    toasts,
    notify,
    dismissToast,
    handleAddAvailability,
    handleDeleteAvailability,
    handleEventSelection,
    refreshAgenda,
  };
}

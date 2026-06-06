// src/hooks/useCalendarEvents.js
import { useMemo } from "react";
import { useDoctorDashboard } from "./useDoctorDashboard";

export function useCalendarEvents() {
  const { allAppointments = [] } = useDoctorDashboard();
  const events = useMemo(() => {
    return allAppointments.map(rdv => ({
      id: rdv.id,
      title: `${rdv.patient} – ${rdv.type}`,
      start: rdv.dateRendezVous,
      allDay: false,
      extendedProps: { ...rdv },
      color: rdv.status === "Confirmé" ? "#10b981" : "#f59e0b",
    }));
  }, [allAppointments]);
  return { events };
}
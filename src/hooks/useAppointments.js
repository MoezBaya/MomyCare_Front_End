import { useState } from "react";

/**
 * useAppointments — hook partagé pour les RDV du gynécologue.
 * ✅ Aligné sur StatusRDV backend : EN_ATTENTE, CONFIRME, ANNULE, REFUSER, TERMINE
 */
export function useAppointments(initialAppointments = []) {
  const [appointments, setAppointments] = useState(initialAppointments);

  // PATCH /api/rdv/{id}/repondre?accepter=true → CONFIRME
  const handleConfirmAppointment = (id) => {
    setAppointments((current) =>
      current.map((appt) => (appt.id === id ? { ...appt, status: "Confirmé" } : appt))
    );
  };

  // PATCH /api/rdv/{id}/repondre?accepter=false → REFUSER
  const handleCancelAppointment = (id) => {
    setAppointments((current) =>
      current.map((appt) => (appt.id === id ? { ...appt, status: "Refusé" } : appt))
    );
  };

  const addAppointment = (appointment) => {
    setAppointments((current) =>
      [...current, appointment].sort((a, b) => (a.time || "").localeCompare(b.time || ""))
    );
  };

  return {
    appointments,
    setAppointments,
    addAppointment,
    handleConfirmAppointment,
    handleCancelAppointment,
  };
}

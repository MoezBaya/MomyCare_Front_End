import { useMemo, useState } from "react";
import { fetchPatientAppointments } from "@/services/patientService";

// ✅ Aligné sur StatusRDV : CONFIRME → "Confirmé"
function isConfirmed(status) {
  return String(status || "").toLowerCase().includes("confirm");
}

// ✅ Aligné : TERMINE → "Terminé", ANNULE → "Annulé", REFUSER → "Refusé"
function isClosedStatus(status) {
  const s = String(status || "").toLowerCase();
  return s.includes("termin") || s.includes("annul") || s.includes("refus");
}

function parseAppointmentDate(dateText) {
  if (!dateText) return null;
  const parsed = new Date(dateText);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function computeDaysToNext(appointment) {
  const date = parseAppointmentDate(appointment?.date);
  if (!date) return "--";
  const today = new Date();
  const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : "--";
}

export function usePatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isReloading, setIsReloading] = useState(false);

  // Prochain RDV confirmé
  const activeNextAppt = useMemo(
    () => appointments.find((appt) => isConfirmed(appt.status)),
    [appointments]
  );

  // RDV clôturés (terminé, annulé, refusé)
  const closedAppointments = useMemo(
    () => appointments.filter((appt) => isClosedStatus(appt.status)),
    [appointments]
  );

  const daysToNext = useMemo(
    () => (activeNextAppt ? computeDaysToNext(activeNextAppt) : "--"),
    [activeNextAppt]
  );

  const replaceAppointments = (newAppointments) => {
    setAppointments(newAppointments || []);
  };

  const addAppointment = (appointment) => {
    setAppointments((current) => [appointment, ...current]);
  };

  const removeAppointment = (id) => {
    setAppointments((current) => current.filter((appt) => appt.id !== id));
  };

  const reloadAppointments = async () => {
    setIsReloading(true);
    try {
      const freshAppointments = await fetchPatientAppointments();
      setAppointments(freshAppointments);
    } catch (err) {
      console.error("[usePatientAppointments] Erreur rechargement :", err?.message);
    } finally {
      setIsReloading(false);
    }
  };

  return {
    appointments,
    activeNextAppt,
    closedAppointments,
    daysToNext,
    isReloading,
    replaceAppointments,
    addAppointment,
    removeAppointment,
    reloadAppointments,
  };
}

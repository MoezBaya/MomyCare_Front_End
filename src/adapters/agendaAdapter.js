import { formatDate, formatTime } from "@/services/dashboardService";

const APPOINTMENT_STATUS_STYLES = {
  "En attente": { backgroundColor: "#fef3c7", borderColor: "#f59e0b", textColor: "#92400e" },
  Confirmé: { backgroundColor: "#dcfce7", borderColor: "#4ade80", textColor: "#166534" },
  Refusé: { backgroundColor: "#fee2e2", borderColor: "#f87171", textColor: "#991b1b" },
  Annulé: { backgroundColor: "#f8fafc", borderColor: "#cbd5e1", textColor: "#334155" },
  Terminé: { backgroundColor: "#e2e8f0", borderColor: "#94a3b8", textColor: "#0f172a" },
};

const DEFAULT_SLOT_MINUTES = 45;

function normalizeStatus(value) {
  const status = String(value || "").toUpperCase();
  if (status.includes("ATTENTE") || status.includes("PENDING")) return "En attente";
  if (status.includes("CONFIRME") || status.includes("CONFIRM")) return "Confirmé";
  if (status.includes("REFUS")) return "Refusé";
  if (status.includes("ANNUL") || status.includes("CANCEL")) return "Annulé";
  if (status.includes("TERMINE") || status.includes("DONE") || status.includes("PASS")) return "Terminé";
  return "En attente";
}

function addMinutes(dateTime, minutes = DEFAULT_SLOT_MINUTES) {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return dateTime;
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

export function normalizeAgendaAppointment(raw = {}) {
  const start = raw.dateRendezVous || raw.date || raw.startTime || "";
  const status = normalizeStatus(raw.statusRDV || raw.status || raw.statut);
  const patient = [raw.patientePrenom, raw.patienteNom].filter(Boolean).join(" ") || raw.patient || "Patiente inconnue";
  const doctor = [raw.gynecologuePrenom, raw.gynecologueNom].filter(Boolean).join(" ") || raw.doctor || "Gynécologue";
  const type = raw.motif || raw.type || "Consultation";
  const style = APPOINTMENT_STATUS_STYLES[status] ?? APPOINTMENT_STATUS_STYLES["En attente"];

  return {
    id: raw.id,
    patient,
    doctor,
    status,
    type,
    date: formatDate(start),
    time: formatTime(start),
    start,
    end: addMinutes(start),
    title: `${patient} • ${type}`,
    backgroundColor: style.backgroundColor,
    borderColor: style.borderColor,
    textColor: style.textColor,
    extendedProps: {
      ...raw,
      eventType: "appointment",
      status,
      type,
      patient,
      doctor,
    },
  };
}

export function normalizeAgendaAvailability(raw = {}) {
  const start = raw.dateTime || raw.date || raw.creneau || "";
  const label = raw.label || `${formatDate(start)} à ${formatTime(start)}`;

  return {
    id: raw.id || `${start}-${Math.random().toString(36).slice(2, 8)}`,
    dateTime: start,
    label,
    date: formatDate(start),
    time: formatTime(start),
    start,
    end: addMinutes(start),
    title: raw.title || "Disponible",
    backgroundColor: "#fce7f3",
    borderColor: "#fb7185",
    textColor: "#831843",
    extendedProps: {
      ...raw,
      eventType: "availability",
    },
  };
}

export function mapAppointmentToCalendarEvent(appointment) {
  return {
    id: `appointment-${appointment.id}`,
    title: appointment.title,
    start: appointment.start,
    end: appointment.end,
    backgroundColor: appointment.backgroundColor,
    borderColor: appointment.borderColor,
    textColor: appointment.textColor,
    extendedProps: appointment,
  };
}

export function mapAvailabilityToCalendarEvent(slot) {
  return {
    id: `slot-${slot.id}`,
    title: slot.title || "Disponible",
    start: slot.start,
    end: slot.end,
    backgroundColor: slot.backgroundColor,
    borderColor: slot.borderColor,
    textColor: slot.textColor,
    extendedProps: slot,
  };
}

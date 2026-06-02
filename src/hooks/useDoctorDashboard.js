// src/hooks/useDoctorDashboard.js
import { useEffect, useMemo, useState } from "react";
import { loadDoctorDashboardData, repondreRdv } from "@/services/dashboardService";
import { addDisponibilite, deleteDisponibilite } from "@/services/disponibiliteService";
import api from "@/services/api";
import { useAppointments } from "./useAppointments";
import { usePatients } from "./usePatients";
import { usePrescriptions } from "./usePrescriptions";

// ============================================================
//  HELPERS
// ============================================================

function buildInitialProfile(user) {
  return {
    nom: user?.nom || user?.login || "Gynécologue",
    prenom: user?.prenom || "",
    email: user?.email || "",
    phone: user?.numeroTelephone || user?.telephone || "",
    adresse: [user?.adresse, user?.ville].filter(Boolean).join(", "),
    specialty: "Gynécologue Obstétricien",
    matriculeCachet: user?.matriculeCachet || "--",
    numeroAgrement: user?.numeroAgrement || "--",
    experience: user?.experience != null ? `${user.experience} ans` : "--",
  };
}

function isWaiting(status) {
  return String(status || "").toLowerCase().includes("attente");
}

function normalizeStatus(statusRDV) {
  const raw = String(statusRDV || "").toUpperCase();
  if (raw.includes("CONFIRME")) return "Confirmé";
  if (raw.includes("ANNUL")) return "Annulé";
  if (raw.includes("REFUS")) return "Refusé";
  if (raw.includes("TERMIN")) return "Terminé";
  return "En attente";
}

/**
 * Normalise un rendez‑vous provenant de l’API
 * @param {Object} a - Données brutes du rendez‑vous
 * @returns {Object} Rendez‑vous formaté pour l’UI et l’agenda
 */
function normalizeAppointmentFromApi(a = {}) {
  const dateValue = a.dateRendezVous;
  const d = new Date(dateValue);
  const isValid = !isNaN(d.getTime());

  const date = isValid
    ? d.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const time = isValid
    ? d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : "";

  const patNom = a.patienteNom || "";
  const patPrenom = a.patientePrenom || "";

  return {
    id: a.id,
    patient: [patPrenom, patNom].filter(Boolean).join(" ") || "--",
    patienteId: a.patienteId,
    gynecologueId: a.gynecologueId,
    date,
    time,
    status: normalizeStatus(a.statusRDV),
    type: a.motif || "CONSULTATION",
    specialty: "Gynécologue Obstétricien",
    // ✅ Champ obligatoire pour FullCalendar
    dateRendezVous: a.dateRendezVous, // conserve la chaîne ISO originale
  };
}

// ============================================================
//  HOOK PRINCIPAL
// ============================================================

export function useDoctorDashboard(user, callbacks = {}) {
  const { onRefreshAgenda } = callbacks;

  const [activeSidebar, setActiveSidebar] = useState("accueil");
  const [activeHeaderTab, setActiveHeaderTab] = useState("tableau");
  const [showAddApptModal, setShowAddApptModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([]);

  const [doctorProfile, setDoctorProfile] = useState(() => buildInitialProfile(user));
  const [availabilities, setAvailabilities] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isRefreshingRdv, setIsRefreshingRdv] = useState(false);
  const [allAppointments, setAllAppointments] = useState([]);

  const appointmentsState = useAppointments([]);
  const patientsState = usePatients([]);
  const prescriptionsState = usePrescriptions([]);

  const counts = useMemo(
    () => ({
      today: appointmentsState.appointments.filter((a) => a.status === "Confirmé").length,
      waiting: appointmentsState.appointments.filter((a) => isWaiting(a.status)).length,
      patients: patientsState.patients.length,
      consultations: prescriptionsState.prescriptions.length,
    }),
    [appointmentsState.appointments, patientsState.patients, prescriptionsState.prescriptions]
  );

  // -------------------- CHARGEMENT INITIAL --------------------
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoadingData(true);
      try {
        const data = await loadDoctorDashboardData();
        if (!isMounted) return;
        setDoctorProfile(data.profile || buildInitialProfile(user));
        if (data.appointments?.length) appointmentsState.setAppointments(data.appointments);
        if (data.patients?.length) patientsState.setPatients(data.patients);
        if (data.availabilities?.length) setAvailabilities(data.availabilities);
        await refreshAllAppointments();
      } catch (err) {
        console.error("[useDoctorDashboard] Erreur chargement :", err?.response?.status, err?.message);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------- RAFFRAÎCHISSEMENTS --------------------
  const refreshAppointments = async () => {
    setIsRefreshingRdv(true);
    try {
      const res = await api.get("/api/rdv/en-attente");
      const raw = res?.data?.body ?? res?.data?.data ?? res?.data ?? [];
      const list = Array.isArray(raw) ? raw : Array.isArray(raw.content) ? raw.content : [];
      appointmentsState.setAppointments(list.map(normalizeAppointmentFromApi));
    } catch (err) {
      console.error("[useDoctorDashboard] Erreur refresh RDV :", err?.message);
    } finally {
      setIsRefreshingRdv(false);
    }
  };

  const refreshAllAppointments = async () => {
    try {
      const res = await api.get("/api/rdv/gyneco/mes-rdv");
      const raw = res?.data?.body ?? res?.data?.data ?? res?.data ?? [];
      const list = Array.isArray(raw) ? raw : Array.isArray(raw.content) ? raw.content : [];
      setAllAppointments(list.map(normalizeAppointmentFromApi));
    } catch (err) {
      console.error("[useDoctorDashboard] Erreur chargement tous RDV :", err);
    }
  };

  const refreshPatientsList = async () => {
    try {
      const res = await api.get("/api/patientes/mes-patientes");
      const data = res?.data?.body ?? res?.data?.data ?? res?.data ?? [];
      patientsState.setPatients(
        data.map((p) => ({
          id: p.id,
          name: `${p.prenom || ""} ${p.nom || ""}`.trim() || "Patient",
          phone: p.numeroTelephone || "",
          email: p.email || "",
          termDate: "—",
          progress: "--",
        }))
      );
    } catch (err) {
      console.error("[useDoctorDashboard] Erreur chargement patients :", err);
    }
  };

  // -------------------- ACTIONS SUR LES RDV --------------------
  const handleConfirmAppointment = async (id) => {
    try {
      await repondreRdv(id, true);
      await refreshAppointments();
      await refreshAllAppointments();
      await refreshPatientsList();
      if (onRefreshAgenda) onRefreshAgenda();
    } catch (err) {
      console.error("[handleConfirmAppointment] Erreur :", err);
    }
    appointmentsState.handleConfirmAppointment(id);
  };

  const handleCancelAppointment = async (id) => {
    try {
      await repondreRdv(id, false);
      await refreshAppointments();
      await refreshAllAppointments();
    } catch (err) {
      console.error("[handleCancelAppointment] Erreur :", err);
    }
    appointmentsState.handleCancelAppointment(id);
  };

  // -------------------- GESTION DES DISPONIBILITÉS --------------------
  const handleAddAvailability = async (jourSemaine, heureDebut, heureFin) => {
    if (!doctorProfile?.id) return null;
    try {
      const saved = await addDisponibilite(doctorProfile.id, jourSemaine, heureDebut, heureFin);
      setAvailabilities((prev) => [...prev, saved]);
      return saved;
    } catch (err) {
      console.error("[handleAddAvailability] Erreur :", err);
      return null;
    }
  };

  const handleDeleteAvailability = async (slotId) => {
    if (!slotId) return;
    try {
      await deleteDisponibilite(slotId, doctorProfile.id);
      setAvailabilities((prev) => prev.filter((slot) => slot.id !== slotId));
    } catch (err) {
      console.error("[handleDeleteAvailability] Erreur :", err);
    }
  };

  // -------------------- AUTRES --------------------
  const addAppointmentWithPatient = ({ patientName, time }) => {
    const name = patientName?.trim();
    if (!name) return null;
    const newAppt = {
      id: Date.now(),
      time: time || "09:00",
      patient: name,
      status: "En attente",
    };
    appointmentsState.addAppointment(newAppt);
    const exists = patientsState.patients.some((p) => p.name.toLowerCase() === name.toLowerCase());
    if (!exists) {
      patientsState.addPatient({
        id: Date.now() + 10,
        name,
        phone: "",
        email: "",
        termDate: "À définir",
        progress: "--",
      });
    }
    return newAppt;
  };

  // -------------------- EXPOSITION --------------------
  return {
    activeSidebar,
    setActiveSidebar,
    activeHeaderTab,
    setActiveHeaderTab,
    showAddApptModal,
    setShowAddApptModal,
    showNotifications,
    setShowNotifications,
    notifications,
    doctorProfile,
    isLoadingData,
    isRefreshingRdv,
    counts,
    availabilities,
    allAppointments,
    patientsState,
    prescriptionsState,
    appointmentsState: {
      ...appointmentsState,
      handleConfirmAppointment,
      handleCancelAppointment,
    },
    addAppointmentWithPatient,
    handleAddAvailability,
    handleDeleteAvailability,
    refreshAppointments,
    refreshAllAppointments,
    refreshPatientsList,
  };
}
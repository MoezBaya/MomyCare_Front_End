import { useEffect, useState } from "react";
import { loadPatientDashboard } from "@/services/patientService";
import { usePatientProfile } from "@/hooks/usePatientProfile";
import { usePatientAppointments } from "@/hooks/usePatientAppointments";
import { usePatientDoctors } from "@/hooks/usePatientDoctors";

export function usePatientDashboard(user) {
  const [activeTab,             setActiveTab]             = useState("accueil");
  const [showBookModal,         setShowBookModal]         = useState(false);
  const [showEditProfileModal,  setShowEditProfileModal]  = useState(false);
  const [showCancelModal,       setShowCancelModal]       = useState(false);
  const [showSearchModal,       setShowSearchModal]       = useState(false);
  const [isLoadingData,         setIsLoadingData]         = useState(false);
  const [appointmentToCancel,   setAppointmentToCancel]   = useState(null);

  const profileState      = usePatientProfile(user);
  const appointmentsState = usePatientAppointments();
  const doctorsState      = usePatientDoctors();

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoadingData(true);
      try {
        // Plus besoin de passer user — le JWT fait le travail
        const data = await loadPatientDashboard();
        if (!isMounted) return;
        profileState.saveProfile(data.profile);
        appointmentsState.replaceAppointments(data.appointments);
        doctorsState.setAvailableDoctors(data.doctors);
        if (data.doctors.length > 0) {
          doctorsState.selectDoctorForBooking(data.doctors[0]?.id || "");
        }
      } catch (err) {
        console.error("[usePatientDashboard] Erreur chargement :", err?.response?.status, err?.message);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [user]);

  const openBookModal        = () => { setShowBookModal(true); doctorsState.loadDoctors(); };
  const openSearchModal      = () => { setShowSearchModal(true); doctorsState.loadDoctors(); };
  const openEditProfileModal = () => setShowEditProfileModal(true);
  const openCancelModal      = (appt = null) => { setAppointmentToCancel(appt); setShowCancelModal(true); };

  const closeBookModal        = () => setShowBookModal(false);
  const closeSearchModal      = () => setShowSearchModal(false);
  const closeEditProfileModal = () => setShowEditProfileModal(false);
  const closeCancelModal      = () => { setShowCancelModal(false); setAppointmentToCancel(null); };

  const handleEditNextAppt = (appt) => {
    doctorsState.selectDoctorForBooking(appt?.gynecologueId || appt?.doctor || "");
    openBookModal();
  };

  const handleBookSuccess = (appt) => {
    appointmentsState.addAppointment(appt);
    // Rafraîchir les créneaux disponibles du gynécologue après réservation
    if (appt?.gynecologueId) {
      doctorsState.reloadDoctorSlots(appt.gynecologueId);
    }
    // Rafraîchir aussi la liste complète des RDV depuis le serveur
    appointmentsState.reloadAppointments();
    closeBookModal();
    setActiveTab("rdv");
  };

  const handleCancelAppointment = (id) => {
    appointmentsState.removeAppointment(id);
    closeCancelModal();
  };

  const handleSaveProfile = (updated) => {
    profileState.saveProfile(updated);
    closeEditProfileModal();
  };

  return {
    user,
    ...profileState,
    ...appointmentsState,
    pastAppointments: appointmentsState.closedAppointments,
    ...doctorsState,
    activeTab,         setActiveTab,
    isLoadingData,
    showBookModal,     showEditProfileModal,
    showCancelModal,   showSearchModal,
    appointmentToCancel,
    openBookModal,     openSearchModal,
    openEditProfileModal, openCancelModal,
    closeBookModal,    closeSearchModal,
    closeEditProfileModal, closeCancelModal,
    handleEditNextAppt,
    handleBookSuccess,
    handleCancelAppointment,
    handleSaveProfile,
  };
}

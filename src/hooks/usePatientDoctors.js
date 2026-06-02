import { useMemo, useState } from "react";
import { fetchAvailableGynecos } from "@/services/patientService";
import { fetchDisponibilitesGyneco } from "@/services/disponibiliteService";

export function usePatientDoctors() {
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState("");
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return availableDoctors;
    return availableDoctors.filter((doc) => {
      const query = searchQuery.toLowerCase();
      return (
        doc.name.toLowerCase().includes(query) ||
        doc.specialty.toLowerCase().includes(query) ||
        doc.hospital.toLowerCase().includes(query)
      );
    });
  }, [availableDoctors, searchQuery]);

  const loadDoctors = async () => {
    if (availableDoctors.length > 0) return availableDoctors;
    setIsLoadingDoctors(true);

    try {
      const doctors = await fetchAvailableGynecos();
      setAvailableDoctors(doctors);
      setSelectedDoctorForBooking(doctors[0]?.id || doctors[0]?.name || "");
      return doctors;
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const reloadDoctorSlots = async (doctorId) => {
    if (!doctorId) return;
    
    try {
      const slots = await fetchDisponibilitesGyneco(doctorId);
      setAvailableDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor.id === doctorId
            ? {
                ...doctor,
                availabilitySlots: slots,
                availability: slots.length > 0 
                  ? `${formatDate(slots[0].dateTime)} à ${formatTime(slots[0].dateTime)}`
                  : "Aucune disponibilité",
              }
            : doctor
        )
      );
    } catch (err) {
      console.error("[usePatientDoctors] Erreur rechargement créneaux :", err?.message);
    }
  };

  const selectDoctorForBooking = (doctor) => {
    setSelectedDoctorForBooking(doctor?.id || doctor?.name || doctor || "");
  };

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  const formatTime = (value) => {
    if (!value) return "";
    const match = String(value).match(/\b\d{2}:\d{2}/);
    return match ? match[0] : String(value);
  };

  return {
    availableDoctors,
    filteredDoctors,
    searchQuery,
    selectedDoctorForBooking,
    isLoadingDoctors,
    setSearchQuery,
    setAvailableDoctors,
    loadDoctors,
    selectDoctorForBooking,
    reloadDoctorSlots,
  };
}

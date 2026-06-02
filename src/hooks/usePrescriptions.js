import { useState } from "react";
import { savePrescription } from "@/services/dashboardService";

export function usePrescriptions(initialPrescriptions = []) {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);

  /**
   * Enregistre une ordonnance.
   * @param {number} consultationId  - ID de la consultation liée (obligatoire)
   * @param {object} payload         - { lignesOrdonnance: [...] }
   */
  const handleSavePrescription = async (consultationId, payload) => {
    const saved = await savePrescription(consultationId, payload);
    if (saved) setPrescriptions((cur) => [saved, ...cur]);
    return saved;
  };

  return {
    prescriptions,
    setPrescriptions,
    handleSavePrescription,
  };
}

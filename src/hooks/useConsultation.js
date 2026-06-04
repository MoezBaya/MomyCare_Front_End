import { useState, useEffect, useCallback } from "react";
import { fetchConsultations, createConsultation } from "@/services/consultationService";

export const useConsultations = (patientId) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchConsultations(patientId);
      setConsultations(data);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const add = useCallback(async (data) => {
    const newConsult = await createConsultation({ ...data, patienteId: patientId });
    setConsultations(prev => [newConsult, ...prev]);
    return newConsult;
  }, [patientId]);

  useEffect(() => { load(); }, [load]);

  return { consultations, loading, add, reload: load };
};
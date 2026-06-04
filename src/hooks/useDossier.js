import { useState, useEffect, useCallback } from "react";
import { fetchDossier, updateDossier } from "@/services/dossierService";

export const useDossier = (patientId) => {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDossier(patientId);
      setDossier(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const save = useCallback(async (data) => {
    try {
      const updated = await updateDossier(patientId, data);
      setDossier(updated);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [patientId]);

  useEffect(() => { load(); }, [load]);

  return { dossier, loading, error, save, reload: load };
};
// src/hooks/useAvailabilities.js
import { useState, useEffect } from "react";
import { fetchMyDisponibilites } from "@/services/disponibiliteService";

export function useAvailabilities() {
  const [availabilities, setAvailabilities] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchMyDisponibilites()
      .then(setAvailabilities)
      .catch(err => setError(err.message));
  }, []);
  return { availabilities, error };
}
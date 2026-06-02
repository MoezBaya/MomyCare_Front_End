import { useState } from "react";

export function usePatients(initialPatients = []) {
  const [patients, setPatients] = useState(initialPatients);

  const addPatient = (patient) => {
    setPatients((current) => [patient, ...current]);
  };

  return {
    patients,
    setPatients,
    addPatient,
  };
}

import { createContext, useContext } from "react";

const PatientContext = createContext(null);

export function PatientProvider({ value, children }) {
  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}

export function usePatientContext() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatientContext must be used inside a PatientProvider");
  }
  return context;
}

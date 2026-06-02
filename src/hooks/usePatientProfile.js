import { useEffect, useState } from "react";

function buildInitialProfile(user) {
  return {
    nom: user?.nom || user?.login || "Patiente",
    matricule: user?.matriculeSociale || user?.matricule || "--",
    birthday: user?.dateDeNaissance || "",
    phone: user?.numeroTelephone || user?.telephone || "",
    email: user?.email || "",
    adresse: [user?.adresse, user?.ville].filter(Boolean).join(", "),
    weekOfPregnancy: user?.semaineGrossesse || "--",
    bloodType: user?.groupeSanguin || "--",
    allergies: user?.allergies || "Non renseigne",
    lastDoctor: "--",
  };
}

export function usePatientProfile(user) {
  const [profile, setProfile] = useState(() => buildInitialProfile(user));
  const [editProfileForm, setEditProfileForm] = useState(() => buildInitialProfile(user));

  useEffect(() => {
    setEditProfileForm(profile);
  }, [profile]);

  const saveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    setEditProfileForm(updatedProfile);
  };

  return {
    profile,
    editProfileForm,
    setEditProfileForm,
    saveProfile,
  };
}

import { useState } from "react";
import { INITIAL_FORM_DATA } from "@/constants/registerConstants";
import { validateRegisterForm } from "@/utils/registerValidation";
import { registerUser, extractErrorMessage } from "@/services/registerService";

// ─── Hook — gère tout l'état et la logique du formulaire ──────
// S : responsabilité unique = orchestrer le formulaire
// O : extensible sans modifier Register.jsx

export function useRegisterForm(onRegisterSuccess) {
  const [formData,       setFormData]       = useState(INITIAL_FORM_DATA);
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [errorMessage,   setErrorMessage]   = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ── Handlers ────────────────────────────────────────────────

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRoleChange = (role) => {
    setFormData({ ...INITIAL_FORM_DATA, role });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const resetMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  // ── Submit ───────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    // Validation locale d'abord
    const validationError = validateRegisterForm(formData);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      await registerUser(formData);

      setSuccessMessage("Inscription reussie.");
      setFormData(INITIAL_FORM_DATA);

      setTimeout(() => onRegisterSuccess(), 700);
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    errorMessage,
    successMessage,
    handleChange,
    handleRoleChange,
    handleSubmit,
  };
}

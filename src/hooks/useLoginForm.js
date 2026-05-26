import { useState } from "react";
import { loginUser, extractLoginError } from "@/services/loginService";

// ─── useLoginForm ─────────────────────────────────────────────
// S : gère uniquement l'état et la logique du formulaire login

export function useLoginForm(initialMessage = "", onLoginSuccess) {
  const [formData,       setFormData]       = useState({ login: "", password: "" });
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [errorMessage,   setErrorMessage]   = useState("");
  const [successMessage, setSuccessMessage] = useState(initialMessage);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);
      const user = await loginUser(formData);
      onLoginSuccess(user);
    } catch (error) {
      setErrorMessage(extractLoginError(error));
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
    handleSubmit,
  };
}

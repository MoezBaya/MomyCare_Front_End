import { FormFeedback } from "@/components/shared/FormFeedback";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { ROLES } from "@/constants/registerConstants";
import {
  CommonFields,
  GynecologueFields,
  PatienteFields,
  PasswordFields,
} from "./RegisterFields";

// ── RegisterForm ──────────────────────────────────────────────

export function RegisterForm({
  formData,
  isSubmitting,
  errorMessage,
  successMessage,
  onChange,
  onSubmit,
}) {
  const isGynecologue = formData.role === ROLES.GYNECOLOGUE;

  return (
    <form onSubmit={onSubmit} className="space-y-4">

      <CommonFields formData={formData} onChange={onChange} />

      {isGynecologue
        ? <GynecologueFields formData={formData} onChange={onChange} />
        : <PatienteFields    formData={formData} onChange={onChange} />
      }

      <PasswordFields formData={formData} onChange={onChange} />

      <FormFeedback errorMessage={errorMessage} successMessage={successMessage} />

      <SubmitButton
        isSubmitting={isSubmitting}
        label="S'inscrire"
        loadingLabel="Inscription..."
      />
    </form>
  );
}

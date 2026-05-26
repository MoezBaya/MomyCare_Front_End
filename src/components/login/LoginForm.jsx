import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared/Field";
import { FormFeedback } from "@/components/shared/FormFeedback";
import { SubmitButton } from "@/components/shared/SubmitButton";

const inputClass = "rounded-xl border-input focus-visible:border-rose-400 focus-visible:ring-rose-400/50";

// ── LoginForm ─────────────────────────────────────────────────

export function LoginForm({
  formData,
  isSubmitting,
  errorMessage,
  successMessage,
  onChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">

      <Field label="Login">
        <Input
          value={formData.login}
          placeholder="Entrez votre login"
          required
          className={inputClass}
          onChange={onChange("login")}
        />
      </Field>

      <Field label="Mot de passe">
        <Input
          type="password"
          value={formData.password}
          placeholder="Entrez votre mot de passe"
          required
          className={inputClass}
          onChange={onChange("password")}
        />
      </Field>

      <FormFeedback errorMessage={errorMessage} successMessage={successMessage} />

      <SubmitButton
        isSubmitting={isSubmitting}
        label="Se connecter"
        loadingLabel="Connexion..."
      />
    </form>
  );
}

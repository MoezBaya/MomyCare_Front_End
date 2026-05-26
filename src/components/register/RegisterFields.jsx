import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared/Field";

const inputClass = "rounded-xl border-input focus-visible:border-rose-400 focus-visible:ring-rose-400/50";

// ── CommonFields ──────────────────────────────────────────────

export function CommonFields({ formData, onChange }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom">
          <Input value={formData.nom} placeholder="Votre nom" required
            className={inputClass} onChange={onChange("nom")} />
        </Field>
        <Field label="Prenom">
          <Input value={formData.prenom} placeholder="Votre prenom" required
            className={inputClass} onChange={onChange("prenom")} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Login">
          <Input value={formData.login} placeholder="Votre login" required minLength={3}
            className={inputClass} onChange={onChange("login")} />
        </Field>
        <Field label="Email">
          <Input type="email" value={formData.email} placeholder="votre.email@example.com" required
            className={inputClass} onChange={onChange("email")} />
        </Field>
      </div>

      <Field label="Date de naissance">
        <Input type="date" value={formData.dateDeNaissance} required
          className={inputClass} onChange={onChange("dateDeNaissance")} />
      </Field>

      <Field label="Adresse">
        <Input value={formData.adresse} placeholder="Votre adresse" required
          className={inputClass} onChange={onChange("adresse")} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ville">
          <Input value={formData.ville} placeholder="Votre ville" required
            className={inputClass} onChange={onChange("ville")} />
        </Field>
        <Field label="Telephone">
          <Input type="tel" value={formData.numeroTelephone} placeholder="Votre telephone" required
            className={inputClass} onChange={onChange("numeroTelephone")} />
        </Field>
      </div>
    </>
  );
}

// ── GynecologueFields ─────────────────────────────────────────

export function GynecologueFields({ formData, onChange }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field label="Cachet">
        <Input type="number" value={formData.matriculeCachet} placeholder="Matricule" required
          className={inputClass} onChange={onChange("matriculeCachet")} />
      </Field>
      <Field label="Agrement">
        <Input value={formData.numeroAgrement} placeholder="Numero" required
          className={inputClass} onChange={onChange("numeroAgrement")} />
      </Field>
      <Field label="Experience">
        <Input type="number" min="0" value={formData.experience} placeholder="Annees" required
          className={inputClass} onChange={onChange("experience")} />
      </Field>
    </div>
  );
}

// ── PatienteFields ────────────────────────────────────────────

export function PatienteFields({ formData, onChange }) {
  return (
    <Field label="Matricule sociale">
      <Input type="number" value={formData.matriculeSociale}
        placeholder="Votre matricule sociale" required
        className={inputClass} onChange={onChange("matriculeSociale")} />
    </Field>
  );
}

// ── PasswordFields ────────────────────────────────────────────

export function PasswordFields({ formData, onChange }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Mot de passe">
        <Input type="password" value={formData.password} placeholder="Mot de passe"
          required minLength={6} className={inputClass} onChange={onChange("password")} />
      </Field>
      <Field label="Confirmation">
        <Input type="password" value={formData.confirmPassword} placeholder="Confirmer"
          required minLength={6} className={inputClass} onChange={onChange("confirmPassword")} />
      </Field>
    </div>
  );
}

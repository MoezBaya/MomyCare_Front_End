// ─── Validation — S : une seule responsabilité ────────────────

/**
 * Valide les champs communs à tous les rôles
 */
function validateCommonFields(data) {
  if (!data.nom.trim())             return "Le nom est obligatoire.";
  if (!data.prenom.trim())          return "Le prenom est obligatoire.";
  if (!data.login || data.login.length < 3)
                                    return "Le login doit contenir au moins 3 caracteres.";
  if (!data.email.includes("@"))    return "L'adresse email est invalide.";
  if (!data.dateDeNaissance)        return "La date de naissance est obligatoire.";
  if (!data.adresse.trim())         return "L'adresse est obligatoire.";
  if (!data.ville.trim())           return "La ville est obligatoire.";
  if (!data.numeroTelephone.trim()) return "Le numero de telephone est obligatoire.";
  if (data.password.length < 6)     return "Le mot de passe doit contenir au moins 6 caracteres.";
  if (data.password !== data.confirmPassword)
                                    return "Les mots de passe ne sont pas identiques.";
  return null;
}

/**
 * Valide les champs spécifiques au rôle Gynecologue
 */
function validateGynecologueFields(data) {
  if (!data.matriculeCachet)  return "Le matricule cachet est obligatoire.";
  if (!data.numeroAgrement)   return "Le numero d'agrement est obligatoire.";
  if (!data.experience && data.experience !== 0)
                              return "L'experience est obligatoire.";
  return null;
}

/**
 * Valide les champs spécifiques au rôle Patiente
 */
function validatePatienteFields(data) {
  if (!data.matriculeSociale) return "Le matricule sociale est obligatoire.";
  return null;
}

/**
 * Point d'entrée principal de la validation
 */
export function validateRegisterForm(data) {
  return (
    validateCommonFields(data) ||
    (data.role === "gynecologue"
      ? validateGynecologueFields(data)
      : validatePatienteFields(data))
  );
}

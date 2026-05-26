function normalizeRoleValue(role) {
  if (!role) return "";

  const value =
    typeof role === "object"
      ? role.name || role.role || role.authority || role.libelle || ""
      : role;

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/^role[_-]/, "");
}

/**
 * Normalize roles from backend.
 * Accepts ["ROLE_GYNECOLOGUE"], "ROLE_PATIENTE" or role objects.
 */
export function normalizeRoles(roles) {
  const list = Array.isArray(roles) ? roles : [roles];

  return list
    .map(normalizeRoleValue)
    .filter(Boolean);
}

/**
 * Get primary role.
 * Returns: "gynecologue" | "patiente" | null
 */
export function normalizeRole(roles) {
  const normalizedRoles = normalizeRoles(roles);

  if (
    normalizedRoles.some((role) =>
      ["gynecologue", "gyneco", "doctor", "medecin"].some((alias) =>
        role.includes(alias)
      )
    )
  ) {
    return "gynecologue";
  }

  if (
    normalizedRoles.some((role) =>
      ["patiente", "patient"].some((alias) => role.includes(alias))
    )
  ) {
    return "patiente";
  }

  return null;
}

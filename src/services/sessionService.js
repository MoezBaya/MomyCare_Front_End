import { STORAGE_KEYS } from "@/constants/loginConstants";
import { normalizeRole } from "@/utils/roleUtils";

// ─────────────────────────────────────────────────────────────
// SessionStorageService
// ─────────────────────────────────────────────────────────────

function setIfDefined(key, value) {
  if (value !== undefined && value !== null) {
    localStorage.setItem(
      key,
      typeof value === "object"
        ? JSON.stringify(value)
        : value
    );
  }
}

// SAVE SESSION
export function saveSession({
  token,
  id,
  login,
  email,
  roles,
  role,
  ...user
}) {

  setIfDefined(STORAGE_KEYS.TOKEN, token);
  setIfDefined(STORAGE_KEYS.USER, {
    ...user,
    id,
    login,
    email,
    roles,
    role,
  });
  setIfDefined(STORAGE_KEYS.ROLES, roles);
  setIfDefined(STORAGE_KEYS.USER_ID, id);
  setIfDefined(STORAGE_KEYS.LOGIN, login);
  setIfDefined(STORAGE_KEYS.EMAIL, email);
}

// CLEAR SESSION
export function clearSession() {

  Object.values(STORAGE_KEYS)
    .forEach((key) => localStorage.removeItem(key));
}

// RESTORE SESSION
export function restoreSession() {

  const token =
    localStorage.getItem(STORAGE_KEYS.TOKEN);

  if (!token) return null;

  try {
    const userRaw =
      localStorage.getItem(STORAGE_KEYS.USER);

    let savedUser = {};

    if (userRaw) {
      try {
        savedUser = JSON.parse(userRaw) || {};
      } catch {
        savedUser = {};
      }
    }

    const id =
      savedUser.id || localStorage.getItem(STORAGE_KEYS.USER_ID);

    const login =
      savedUser.login || localStorage.getItem(STORAGE_KEYS.LOGIN);

    const email =
      savedUser.email || localStorage.getItem(STORAGE_KEYS.EMAIL);

    const rolesRaw =
      localStorage.getItem(STORAGE_KEYS.ROLES);

    let roles = savedUser.roles || [];

    if (!roles.length && rolesRaw) {

      try {

        roles = JSON.parse(rolesRaw);

        if (!Array.isArray(roles)) {
          roles = [rolesRaw];
        }

      } catch {

        roles = [rolesRaw];
      }
    }

    const role = normalizeRole(roles);

    return {
      ...savedUser,
      id,
      login,
      email,
      roles,
      role,
    };

  } catch {

    return null;
  }
}

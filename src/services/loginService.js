import api from "@/services/api";
import { API_LOGIN_URL } from "@/constants/loginConstants";
import { normalizeRoles, normalizeRole } from "@/utils/roleUtils";
import { saveSession } from "@/services/sessionService";

function getResponsePayload(responseData) {
  return responseData?.body || responseData?.data || responseData || {};
}

function getUserPayload(payload) {
  return payload?.user || payload?.utilisateur || payload?.account || payload;
}

function getToken(payload) {
  return (
    payload?.token ||
    payload?.accessToken ||
    payload?.jwt ||
    payload?.body?.token ||
    payload?.body?.accessToken ||
    payload?.body?.jwt
  );
}

// loginUser: appel API + extraction des donnees + sauvegarde session

export async function loginUser({ login, password }) {
  const response = await api.post(API_LOGIN_URL, {
    login,
    password,
  });

  const payload = getResponsePayload(response.data);
  const userData = getUserPayload(payload);

  const token = getToken(payload);
  const id = userData?.id || userData?.userId || payload?.id || payload?.userId;
  const userLogin =
    userData?.login ||
    userData?.username ||
    userData?.nomUtilisateur ||
    payload?.login ||
    login;
  const email = userData?.email || payload?.email;
  const rawRoles =
    userData?.roles ||
    userData?.role ||
    userData?.authorities ||
    payload?.roles ||
    payload?.role ||
    payload?.authorities ||
    [];

  const roles = normalizeRoles(rawRoles);
  const role = normalizeRole(roles);

  const user = {
    ...userData,
    id,
    login: userLogin,
    email,
    roles,
    role,
  };

  saveSession({ token, ...user });

  return user;
}

export function extractLoginError(error) {
  const status = error.response?.status;
  const backend = error.response?.data?.message
    || error.response?.data?.error
    || error.response?.data;

  return typeof backend === "string"
    ? backend
    : `Identifiants incorrects. Veuillez reessayer.${status ? ` (${status})` : ""}`;
}

import api from "@/services/api";

export const fetchDossier = (patienteId) => 
  api.get(`/api/dossiers/patiente/${patienteId}`).then(res => res.data?.body ?? res.data);

export const updateDossier = (patienteId, data) => 
  api.put(`/api/dossiers/patiente/${patienteId}`, data).then(res => res.data?.body ?? res.data);
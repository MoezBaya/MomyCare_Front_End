import api from "@/services/api";

export const fetchConsultations = (patienteId) => 
  api.get(`/api/consultations/patiente/${patienteId}`).then(res => res.data?.body ?? res.data);

export const createConsultation = (data) => 
  api.post(`/api/consultations`, data).then(res => res.data?.body ?? res.data);
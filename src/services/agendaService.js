import { requestRdv } from "@/services/dashboardService";
import {
  loadDoctorDashboardData,
  fetchAvailableGynecos,
} from "@/services/dashboardService";
import {
  fetchDisponibilitesGyneco,
  addDisponibilites,
  deleteDisponibilite,
} from "@/services/disponibiliteService";

export async function loadDoctorAgendaData() {
  return await loadDoctorDashboardData();
}

export async function fetchDoctorsForBooking() {
  return await fetchAvailableGynecos();
}

export async function fetchDoctorSlots(gynecologueId) {
  return await fetchDisponibilitesGyneco(gynecologueId);
}

export async function addDoctorAvailability(gynecologueId, dateTime) {
  return await addDisponibilites(gynecologueId, [{ dateTime }]);
}

export async function deleteDoctorAvailability(availabilityId, gynecologueId) {
  return await deleteDisponibilite(availabilityId, gynecologueId);
}

export async function bookAppointment(payload) {
  return await requestRdv(payload);
}

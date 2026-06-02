import { requestRdv as requestRdvAPI } from "@/services/dashboardService";

export const requestRdv = async (payload) => {
  return await requestRdvAPI(payload);
};

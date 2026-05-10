import { apiCall } from "@/lib/api";

export const dashboardService = {
  getStats: () => apiCall("dashboard/stats", "GET"),
};

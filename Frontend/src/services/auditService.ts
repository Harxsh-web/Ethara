import { apiCall } from "@/lib/api";

export const auditService = {
  getAllLogs: (page = 1, limit = 20) => apiCall(`audit-logs?page=${page}&limit=${limit}`, "GET"),
};

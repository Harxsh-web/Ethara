import { apiCall } from "@/lib/api";

export const taskService = {
  getTasks: async (page = 1, limit = 10) => {
    return apiCall(`/tasks?page=${page}&limit=${limit}`, "GET");
  },

  createTask: async (data: any) => {
    return apiCall("/tasks", "POST", data);
  },

  updateTask: async (id: string, data: any) => {
    return apiCall(`/tasks/${id}`, "PUT", data);
  },

  deleteTask: async (id: string) => {
    return apiCall(`/tasks/${id}`, "DELETE");
  },
};

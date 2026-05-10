import { apiCall } from "@/lib/api";

export const projectService = {
  getProjects: async (page = 1, limit = 8) => {
    return apiCall(`/projects?page=${page}&limit=${limit}`, "GET");
  },

  createProject: async (data: any) => {
    return apiCall("/projects", "POST", data);
  },

  updateProject: async (id: string, data: any) => {
    return apiCall(`/projects/${id}`, "PUT", data);
  },

  deleteProject: async (id: string) => {
    return apiCall(`/projects/${id}`, "DELETE");
  },
};

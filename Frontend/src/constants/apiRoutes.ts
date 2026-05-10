export const API_ROUTES = {
  AUTH: {
    REGISTER: "auth/register",
    LOGIN: "auth/login",
    ME: "auth/me",
    LOGOUT: "auth/logout",
  },
  PROJECTS: {
    GET_ALL: "projects",
    CREATE: "projects",
    GET_BY_ID: (id: string) => `projects/${id}`,
    UPDATE: (id: string) => `projects/${id}`,
    DELETE: (id: string) => `projects/${id}`,
  },
  TASKS: {
    GET_ALL: "tasks",
    GET_PROJECT_TASKS: (projectId: string) => `projects/${projectId}/tasks`,
    CREATE: (projectId: string) => `projects/${projectId}/tasks`,
    GET_BY_ID: (id: string) => `tasks/${id}`,
    UPDATE: (id: string) => `tasks/${id}`,
    DELETE: (id: string) => `tasks/${id}`,
  },
  DASHBOARD: {
    STATS: "dashboard/stats",
  }
};

import { apiCall } from "@/lib/api";
import { API_ROUTES } from "@/constants/apiRoutes";

export const userService = {
  getProfile: () => apiCall(API_ROUTES.AUTH.ME, "GET"),
  updateProfile: (data: any) => apiCall(API_ROUTES.AUTH.ME, "PUT", data),
  
  // Admin Methods
  getAllUsers: () => apiCall("users", "GET"),
  getUser: (id: string) => apiCall(`users/${id}`, "GET"),
  createUser: (data: any) => apiCall("users", "POST", data),
  updateUser: (id: string, data: any) => apiCall(`users/${id}`, "PUT", data),
  deleteUser: (id: string) => apiCall(`users/${id}`, "DELETE"),
};

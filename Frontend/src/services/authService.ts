import { apiCall } from "@/lib/api";
import { API_ROUTES } from "@/constants/apiRoutes";

export const authService = {
  register: (userData: any) => apiCall(API_ROUTES.AUTH.REGISTER, "POST", userData),
  login: (credentials: any) => apiCall(API_ROUTES.AUTH.LOGIN, "POST", credentials),
  getMe: () => apiCall(API_ROUTES.AUTH.ME, "GET"),
};

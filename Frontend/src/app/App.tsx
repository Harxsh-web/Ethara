import { useRoutes } from "react-router-dom";
import { appRoutes } from "./router";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "@/services/authService";
import { setUser, clearUser, setLoading } from "@/store/userSlice";
import type { RootState, AppDispatch } from "@/store";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        dispatch(setLoading(true));
        try {
          const res = await authService.getMe();
          if (res.success) {
            dispatch(setUser({ user: res.data, token: storedToken }));
          } else {
            dispatch(clearUser());
          }
        } catch (error) {
          dispatch(clearUser());
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    fetchProfile();
  }, [dispatch]);

  return useRoutes(appRoutes);
}

export default App;


import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setUser, clearUser, setLoading, updateUser } = userSlice.actions;
export default userSlice.reducer;


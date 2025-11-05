import { create } from "zustand";
import api from "../api/api";

const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  resetError: () => set({ error: null }),

  register: async (payload) => {
    set({ loading: true, error: null });

    try {
      const res = await api.post("/auth/register/", payload);

      // If backend returns user, store it (optional):
      const newUser = res?.data?.user ?? null;

      set({ user: newUser, loading: false });
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Registration failed";

      set({ error: msg, loading: false });
      throw err;
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null });

    try {
      const res = await api.post("/auth/login/", { email, password });

      const access = res?.data?.access || res?.data?.token;
      const user = res?.data?.user ?? null;

      if (access) {
        localStorage.setItem("access_token", access); // ✅ this makes axios attach token
      }

      set({
        user,
        isAuthenticated: Boolean(access),
        loading: false,
        error: null,
      });

      // If backend doesn't return user in login → fetch profile
      if (!user) {
        await get().getProfile();
      }

      return res.data;
    } catch (err) {
      localStorage.removeItem("token");

      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Invalid credentials";

      set({ error: msg, isAuthenticated: false, loading: false });
      throw err;
    }
  },

  getProfile: async () => {
    try {
      const res = await api.get("/auth/profile/");
    //   console.log(res)
      set({ user: res.data, isAuthenticated: true });
      return res.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        get().logout();
      }
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false, error: null });
  },
}));

export default useAuthStore;

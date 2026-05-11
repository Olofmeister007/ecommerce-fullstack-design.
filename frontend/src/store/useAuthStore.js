import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user:  null,   // { id, name, email, role }

      setAuth: (token, user) => set({ token, user }),

      logout: () => set({ token: null, user: null }),

      // Helpers
      isLoggedIn: () => !!useAuthStore.getState().token,
      isAdmin:    () => useAuthStore.getState().user?.role === "admin",
    }),
    { name: "auth-storage" } // persists to localStorage
  )
);

export default useAuthStore;
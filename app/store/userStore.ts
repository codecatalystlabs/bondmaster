import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
   user: {
      username: string;
      group: string;
      location: string;
   } | null;
   token: string | null; // Add token field
   setUser: (user: { username: string; group: string; location: string }) => void;
   setToken: (token: string) => void; 
   clearUser: () => void;
   clearToken: () => void; 
}

const useUserStore = create<UserState>()(
   persist(
      (set) => ({
         user: null,
         token: null, 
         setUser: (user) => set({ user }),
         setToken: (token) => set({ token }),
         clearUser: () => set({ user: null }),
         clearToken: () => set({ token: null }), 
      }),
      {
         name: "user-details",
         storage: createJSONStorage(() => localStorage), 
      }
   )
);

export default useUserStore;
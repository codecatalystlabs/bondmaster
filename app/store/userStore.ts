import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
   user: {
      username: string;
      group: string;
      location: string;
   } | null;
   setUser: (user: { username: string; group: string; location: string }) => void;
   clearUser: () => void;
}

const useUserStore = create<UserState>()(
   persist(
      (set) => ({
         user: null,
         setUser: (user) => set({ user }),
         clearUser: () => set({ user: null }),
      }),
      {
         name: "user-details", 
         storage: createJSONStorage(() => localStorage)
      }
   )
);

export default useUserStore;

import { StateCreator } from "zustand";

type UserState = {
  full_name: string;
  email: string;
  isAuthenticated: boolean;
};

type UserActions = {
  logoutUserStore: () => void;
};

export type UserSlice = UserState & UserActions;

export const createUserSlice: StateCreator<
  UserSlice,
  [["zustand/immer", never]],
  [],
  UserSlice
> = (set) => ({
  email: "",
  full_name: "",
  isAuthenticated: false,
  logoutUserStore: () => {
    set((state) => {
      state.email = "";
      state.full_name = "";
      state.isAuthenticated = false;
    });
  },
});

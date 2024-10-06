import { User } from "@/types/user.types";
import { StateCreator } from "zustand";
import Cookies from "js-cookie";

type UserState = {
  full_name: string;
  email: string;
};

type UserActions = {
  fetchUserStore: () => Promise<void>;
  loginUserStore: (data: User | undefined) => void;
  updateUserStore: (name: keyof UserState, value: string) => void;
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
  fetchUserStore: async () => {},
  loginUserStore: (data) => {
    if (!data) {
      return;
    }
    set((state) => {
      state.email = data.email;
      state.full_name = data.full_name;
    });
    Cookies.set("token", data.token, {
      expires: 1, // expires in 7 days
    });
  },
  updateUserStore: (name, value) => {
    set((state) => {
      state[name] = value;
    });
  },
  logoutUserStore: () => {
    set((state) => {
      state.email = "";
      state.full_name = "";
    });
    Cookies.remove("token");
  },
});

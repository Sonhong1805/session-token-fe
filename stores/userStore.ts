import { User } from "@/types/user";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UserState {
  user: User;
  isLogin: boolean;
  login: (payload: User) => void;
  logout: () => void;
}

const initialState: UserState = {
  user: {} as User,
  isLogin: false,
  login: () => {},
  logout: () => {},
};

export const useUserStore = create<UserState>()(
  immer((set) => ({
    ...initialState,
    login: (payload) =>
      set((state) => {
        state.user = payload;
        state.isLogin = true;
      }),
    logout: () => {
      set((state) => {
        state.user = initialState.user;
        state.isLogin = false;
      });
    },
  }))
);

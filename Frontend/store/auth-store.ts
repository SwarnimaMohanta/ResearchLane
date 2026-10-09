import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  getCurrentUser,
  googleLogin,
  loginUser,
} from "@/lib/api";

import type {
  CurrentUser,
  LoginRequest,
} from "@/types/auth";

type AuthState = {
  token: string | null;
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialized: boolean;
  hydrated: boolean;

  login: (data: LoginRequest) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  setToken: (token: string) => void;
  initializeAuth: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      initialized: false,
      hydrated: false,

      login: async (data) => {
        set({ isLoading: true });

        try {
          const { access_token } = await loginUser(data);

          set({
            token: access_token,
            isAuthenticated: true,
          });

          const user = await getCurrentUser(access_token);

          set({
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });

          throw error;
        } finally {
          set({
            isLoading: false,
            initialized: true,
          });
        }
      },

      googleLogin: async (credential) => {
        set({ isLoading: true });

        try {
          const { access_token } =
            await googleLogin(credential);

          set({
            token: access_token,
            isAuthenticated: true,
          });

          const user =
            await getCurrentUser(access_token);

          set({
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });

          throw error;
        } finally {
          set({
            isLoading: false,
            initialized: true,
          });
        }
      },

      setToken: (token) =>
        set({
          token,
          isAuthenticated: true,
        }),

      initializeAuth: async () => {
        const { token } = get();

        if (!token) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            initialized: true,
          });

          return;
        }

        set({ isLoading: true });

        try {
          const user = await getCurrentUser(token);

          set({
            user,
            isAuthenticated: true,
          });
        } catch {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
        } finally {
          set({
            isLoading: false,
            initialized: true,
          });
        }
      },

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          initialized: true,
        }),
    }),

    {
      name: "researchlane-auth",

      onRehydrateStorage: () => {
        return () => {
          useAuthStore.setState({
            hydrated: true,
          });
        };
      },
    }
  )
);
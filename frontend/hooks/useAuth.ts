
import { create } from 'zustand';
import { useBackend } from './useBackend';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    const { call } = useBackend.getState();
    try {
      const response = await call('auth.login', { email, password });
      const token = response.token;
      localStorage.setItem('authToken', token);
      set({ token, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      set({ error: errorMessage, isLoading: false, isAuthenticated: false });
      throw new Error(errorMessage);
    }
  },

  register: async (userData: any) => {
    set({ isLoading: true, error: null });
    const { call } = useBackend.getState();
    try {
      // The register endpoint automatically logs the user in, so we expect a token.
      await call('auth.register', userData);
      // After successful registration, log the user in to get a token
      await get().login(userData.email, userData.password);
      
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    set({ token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    set({ isLoading: true });
    const token = localStorage.getItem('authToken');
    if (token) {
      set({ token, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));

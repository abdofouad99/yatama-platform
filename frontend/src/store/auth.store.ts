import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  roleName: string;
  permissions: string[];
}

interface AuthState {
  user:     AuthUser | null;
  token:    string | null;
  setUser:  (user: AuthUser, token: string) => void;
  logout:   () => void;
  hasPermission: (slug: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:  null,
      token: null,

      setUser: (user, token) => {
        localStorage.setItem('yatama_token', token);
        set({ user, token });
      },

      logout: () => {
        localStorage.removeItem('yatama_token');
        set({ user: null, token: null });
      },

      hasPermission: (slug) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === 'super_admin') return true;
        return user.permissions.includes(slug);
      },
    }),
    {
      name: 'yatama-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

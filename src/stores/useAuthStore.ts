import { create } from 'zustand';
import { supabaseService } from '../services/supabaseService';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  // Actions
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,

  signUp: async (email: string, password: string, fullName?: string) => {
    set({ loading: true });
    const { data, error } = await supabaseService.auth.signUp(email, password, fullName);

    if (!error && data.user) {
      set({ user: data.user, session: data.session, loading: false });
    } else {
      set({ loading: false });
    }

    return { error };
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    const { data, error } = await supabaseService.auth.signIn(email, password);

    if (!error && data.user) {
      set({ user: data.user, session: data.session, loading: false });
    } else {
      set({ loading: false });
    }

    return { error };
  },

  signOut: async () => {
    set({ loading: true });
    await supabaseService.auth.signOut();
    set({ user: null, session: null, loading: false });
  },

  initialize: async () => {
    const { session, error } = await supabaseService.auth.getSession();

    if (session) {
      const { user } = await supabaseService.auth.getCurrentUser();
      set({ user: user || null, session, loading: false, initialized: true });
    } else {
      set({ user: null, session: null, loading: false, initialized: true });
    }
  },

  setUser: (user: User | null) => set({ user }),
  setSession: (session: Session | null) => set({ session }),
}));

// Initialize auth state when the module loads
supabaseService.auth.onAuthStateChange((event, session) => {
  const state = useAuthStore.getState();

  if (event === 'SIGNED_IN' && session) {
    state.setUser(session.user);
    state.setSession(session);
  } else if (event === 'SIGNED_OUT') {
    state.setUser(null);
    state.setSession(null);
  } else if (event === 'TOKEN_REFRESHED' && session) {
    state.setSession(session);
  }
});

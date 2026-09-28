import { useRouter, useSegments } from 'expo-router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { login as apiLogin, register as apiRegister } from '@/src/services/api';
import { readJson, removeItem, saveJson, STORAGE_KEYS } from '@/src/lib/storage';
import type { User } from '@/src/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signUp: (nome: string, email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => { (async () => { const stored = await readJson<User>(STORAGE_KEYS.user); setUser(stored); setLoading(false); })(); }, []);
  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) router.replace('/(auth)/login');
    if (user && inAuth) router.replace('/(tabs)');
  }, [loading, user, segments, router]);
  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async signIn(email, senha) { const result = await apiLogin(email.trim(), senha); await saveJson(STORAGE_KEYS.token, result.token); await saveJson(STORAGE_KEYS.user, result.usuario); setUser(result.usuario); },
    async signUp(nome, email, senha) { const result = await apiRegister(nome.trim(), email.trim(), senha); await saveJson(STORAGE_KEYS.token, result.token); await saveJson(STORAGE_KEYS.user, result.usuario); setUser(result.usuario); },
    async signOut() { await removeItem(STORAGE_KEYS.token); await removeItem(STORAGE_KEYS.user); setUser(null); router.replace('/(auth)/login'); },
  }), [loading, router, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider'); return context; }

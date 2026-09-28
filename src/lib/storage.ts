import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  token: '@agendaflow/token',
  user: '@agendaflow/user',
};

export async function saveJson<T>(key: string, value: T) { await AsyncStorage.setItem(key, JSON.stringify(value)); }
export async function readJson<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}
export async function removeItem(key: string) { await AsyncStorage.removeItem(key); }

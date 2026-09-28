import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '@/src/constants/theme';
import { useAuth } from '@/src/context/AuthContext';

export default function TabsLayout() {
  const { user } = useAuth();
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: '#9AA1B1', tabBarLabelStyle: { fontSize: 10, fontWeight: '800', marginBottom: 2 }, tabBarStyle: { height: 72, paddingTop: 8, paddingBottom: 9, backgroundColor: colors.surface, borderTopColor: colors.border }, tabBarItemStyle: { borderRadius: 16, marginHorizontal: 2 }, tabBarHideOnKeyboard: true }}><Tabs.Screen name="index" options={{ title: 'Serviços', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>✦</Text> }} /><Tabs.Screen name="agenda" options={{ title: 'Agenda', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>◷</Text> }} /><Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>○</Text> }} /><Tabs.Screen name="admin" options={{ href: user?.role === 'ADMIN' ? '/admin' : null, title: 'Admin', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>✎</Text> }} /></Tabs>;
}

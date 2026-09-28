import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { colors } from '@/src/constants/theme';
export default function Index() { const { user, loading } = useAuth(); if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}><ActivityIndicator color={colors.primary} size="large" /></View>; return <Redirect href={user ? '/(tabs)' : '/(auth)/login'} />; }

import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { EmptyState, Pill, Screen, SectionTitle } from '@/src/components/ui';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { listAppointments } from '@/src/services/api';
import type { Appointment } from '@/src/types';

export default function AgendaScreen() {
  const { user } = useAuth(); const router = useRouter(); const [items, setItems] = useState<Appointment[]>([]); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { if (!user) return; setLoading(true); try { setItems(await listAppointments(user.id)); } finally { setLoading(false); } }, [user]);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  return <Screen padded={false}><FlatList data={items} keyExtractor={(x) => x.id} contentContainerStyle={styles.content} ListHeaderComponent={<><View style={styles.header}><View><Text style={styles.kicker}>SEUS HORÁRIOS</Text><Text style={styles.title}>Minha agenda</Text><Text style={styles.subtitle}>Acompanhe confirmações e próximos compromissos.</Text></View><View style={styles.headerIcon}><Text style={styles.headerIconText}>◷</Text></View></View>{loading ? <View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={styles.loadingText}>Atualizando agenda...</Text></View> : null}<SectionTitle title="Agendamentos" icon="✓" /></>} renderItem={({ item }) => <Pressable onPress={() => router.push({ pathname: '/appointment/[id]', params: { id: item.id } })} style={({ pressed }) => [styles.card, { transform: [{ scale: pressed ? 0.99 : 1 }] }]}>
    <View style={styles.dateBlock}><Text style={styles.month}>{new Date(`${item.data}T12:00:00`).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</Text><Text style={styles.day}>{new Date(`${item.data}T12:00:00`).getDate()}</Text><Text style={styles.time}>{item.hora}</Text></View><View style={styles.body}><View style={styles.serviceRow}><Text style={styles.service} numberOfLines={1}>{item.serviceName}</Text><Pill text={item.status} tone={item.status === 'CONFIRMADO' ? 'green' : item.status === 'CANCELADO' ? 'red' : 'orange'} /></View><Text style={styles.detail}>● {item.profissional}</Text><Text style={styles.detail}>⌖ {item.local}</Text><View style={styles.openRow}><Text style={styles.open}>Abrir acompanhamento</Text><Text style={styles.arrow}>→</Text></View></View>
  </Pressable>} ListEmptyComponent={!loading ? <EmptyState icon="◷" title="Nenhum agendamento ainda" description="Escolha um serviço e reserve seu próximo horário." /> : null} /></Screen>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: 22, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  kicker: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: 29, fontWeight: '900', marginTop: 4 },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 5, maxWidth: 285 },
  headerIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  headerIconText: { color: colors.primaryDark, fontSize: 24, fontWeight: '900' },
  loading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  loadingText: { color: colors.muted, fontSize: 12 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12, flexDirection: 'row', marginBottom: 10, ...shadow.card },
  dateBlock: { width: 70, minHeight: 116, borderRadius: 17, backgroundColor: colors.dark, alignItems: 'center', justifyContent: 'center' },
  month: { color: '#B6B9C7', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  day: { color: colors.white, fontSize: 30, fontWeight: '900', marginTop: 2 },
  time: { color: '#AFA9FF', fontSize: 11, fontWeight: '900', marginTop: 5 },
  body: { flex: 1, paddingLeft: 13, paddingTop: 3 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  service: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '900' },
  detail: { color: colors.muted, fontSize: 11, marginTop: 6 },
  openRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  open: { color: colors.primaryDark, fontSize: 11, fontWeight: '900' },
  arrow: { color: colors.primary, fontSize: 18, fontWeight: '900' },
});

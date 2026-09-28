import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppointmentTimeline } from '@/src/components/AppointmentTimeline';
import { Button, Pill, Screen } from '@/src/components/ui';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { getAppointment } from '@/src/services/api';
import type { Appointment } from '@/src/types';

export default function AppointmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const router = useRouter(); const [appointment, setAppointment] = useState<Appointment | null>(null);
  const load = useCallback(async () => { try { setAppointment(await getAppointment(String(id))); } catch {} }, [id]);
  useEffect(() => { load(); }, [load]); useEffect(() => { const timer = setInterval(load, 2000); return () => clearInterval(timer); }, [load]);
  if (!appointment) return <Screen><ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} /></Screen>;
  const isConfirmed = appointment.status === 'CONFIRMADO'; const isCancelled = appointment.status === 'CANCELADO';
  return <Screen padded={false}><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.header}><View><Text style={styles.kicker}>ACOMPANHAMENTO</Text><Text style={styles.title}>Seu agendamento</Text></View><View style={[styles.live, isConfirmed && styles.liveConfirmed, isCancelled && styles.liveCancelled]}><View style={styles.liveDot} /><Text style={styles.liveText}>{isConfirmed ? 'CONFIRMADO' : isCancelled ? 'CANCELADO' : 'PROCESSANDO'}</Text></View></View>
    <View style={styles.mainCard}><View style={styles.iconBlock}><Text style={styles.icon}>✦</Text></View><View style={{ flex: 1 }}><Text style={styles.service}>{appointment.serviceName}</Text><Text style={styles.id}># {appointment.id}</Text><View style={{ marginTop: 9 }}><Pill text={appointment.status} tone={isConfirmed ? 'green' : isCancelled ? 'red' : 'orange'} /></View></View></View>
    <View style={styles.detailCard}><View style={styles.detail}><Text style={styles.detailIcon}>◷</Text><View><Text style={styles.detailLabel}>Data e horário</Text><Text style={styles.detailValue}>{new Date(`${appointment.data}T12:00:00`).toLocaleDateString('pt-BR')} às {appointment.hora}</Text></View></View><View style={styles.detail}><Text style={styles.detailIcon}>○</Text><View><Text style={styles.detailLabel}>Profissional</Text><Text style={styles.detailValue}>{appointment.profissional}</Text></View></View><View style={styles.detail}><Text style={styles.detailIcon}>⌖</Text><View><Text style={styles.detailLabel}>Local</Text><Text style={styles.detailValue}>{appointment.local}</Text></View></View></View>
    <AppointmentTimeline status={appointment.status} />
    <Button title="Voltar para serviços" variant="secondary" onPress={() => router.replace('/(tabs)')} icon="←" />
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: 20, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  kicker: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  title: { fontSize: 28, fontWeight: '900', color: colors.text, marginTop: 4 },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.warningSoft, paddingHorizontal: 9, paddingVertical: 7, borderRadius: radius.pill, marginTop: 2 },
  liveConfirmed: { backgroundColor: colors.accentSoft },
  liveCancelled: { backgroundColor: colors.dangerSoft },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning },
  liveText: { color: colors.warning, fontSize: 9, fontWeight: '900' },
  mainCard: { backgroundColor: colors.dark, borderRadius: radius.xl, padding: 16, flexDirection: 'row', alignItems: 'center', ...shadow.card },
  iconBlock: { width: 58, height: 58, borderRadius: 19, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  icon: { color: colors.white, fontSize: 24, fontWeight: '900' },
  service: { color: colors.white, fontSize: 18, fontWeight: '900' },
  id: { color: '#A9ADBC', fontSize: 11, marginTop: 3 },
  detailCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 15, marginVertical: 12 },
  detail: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 7 },
  detailIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: colors.primarySoft, color: colors.primaryDark, textAlign: 'center', textAlignVertical: 'center', fontSize: 16, paddingTop: 6 },
  detailLabel: { color: colors.muted, fontSize: 10 },
  detailValue: { color: colors.text, fontSize: 13, fontWeight: '800', marginTop: 2 },
});

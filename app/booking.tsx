import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, InfoBanner, Pill, Screen } from '@/src/components/ui';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { createAppointment, getAvailableSlots, getService } from '@/src/services/api';
import type { Service, TimeSlot } from '@/src/types';

function datePlus(days: number) { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }

export default function BookingScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>(); const { user } = useAuth(); const router = useRouter();
  const [service, setService] = useState<Service | null>(null); const [date, setDate] = useState(datePlus(1)); const [slots, setSlots] = useState<TimeSlot[]>([]); const [selected, setSelected] = useState<TimeSlot | null>(null); const [loading, setLoading] = useState(true); const [submitting, setSubmitting] = useState(false);
  const dates = useMemo(() => Array.from({ length: 5 }, (_, i) => datePlus(i + 1)), []);
  useEffect(() => { getService(String(serviceId)).then(setService).catch(() => undefined); }, [serviceId]);
  useEffect(() => { setLoading(true); getAvailableSlots(String(serviceId), date).then(setSlots).finally(() => setLoading(false)); setSelected(null); }, [serviceId, date]);
  async function submit() {
    if (!user || !selected) return; setSubmitting(true);
    try { const appt = await createAppointment({ clienteId: user.id, serviceId: String(serviceId), slotId: selected.id, data: selected.data, hora: selected.hora }); router.replace({ pathname: '/appointment/[id]', params: { id: appt.id } }); }
    catch (e) { Alert.alert('Horário indisponível', e instanceof Error ? e.message : 'Não foi possível reservar.'); }
    finally { setSubmitting(false); }
  }

  return <Screen padded={false}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.kicker}>RESERVA</Text><Text style={styles.title}>Escolha seu horário</Text>
    {service ? <View style={styles.serviceCard}><View style={styles.serviceIcon}><Text style={styles.serviceIconText}>✦</Text></View><View style={{ flex: 1 }}><Text style={styles.serviceName}>{service.nome}</Text><Text style={styles.serviceMeta}>{service.profissional} · {service.duracaoMinutos} min</Text><View style={{ marginTop: 8 }}><Pill text={service.local} tone="gray" icon="⌖" /></View></View></View> : null}
    <Text style={styles.section}>1. Escolha a data</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>{dates.map((d) => <Pressable key={d} onPress={() => setDate(d)} style={[styles.dateCard, date === d && styles.dateActive]}><Text style={[styles.dateDay, date === d && styles.dateTextActive]}>{new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</Text><Text style={[styles.dateNum, date === d && styles.dateTextActive]}>{new Date(`${d}T12:00:00`).getDate()}</Text><Text style={[styles.dateMonth, date === d && styles.dateTextActive]}>{new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</Text></Pressable>)}</ScrollView>
    <Text style={styles.section}>2. Escolha o horário</Text>
    {loading ? <View style={styles.slotLoading}><Text style={styles.muted}>Carregando horários disponíveis...</Text></View> : <View style={styles.grid}>{slots.map((slot) => <Pressable disabled={!slot.disponivel} key={slot.id} onPress={() => setSelected(slot)} style={[styles.slot, !slot.disponivel && styles.slotDisabled, selected?.id === slot.id && styles.slotActive]}><Text style={[styles.slotText, selected?.id === slot.id && styles.slotTextActive]}>{slot.hora}</Text><Text style={[styles.slotCaption, selected?.id === slot.id && styles.slotTextActive]}>{slot.disponivel ? 'Disponível' : 'Ocupado'}</Text></Pressable>)}</View>}
    <InfoBanner title="Tentativa simultânea" description="Se outro usuário reservar este mesmo horário antes de você, o backend poderá recusar a solicitação. A transação garante a consistência." icon="!" tone="warning" />
    <Button title={selected ? `Confirmar ${selected.hora}` : 'Selecione um horário'} onPress={submit} loading={submitting} disabled={!selected} icon="→" />
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: 18, paddingBottom: 110 },
  kicker: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  title: { fontSize: 29, fontWeight: '900', color: colors.text, marginTop: 4, marginBottom: 18 },
  serviceCard: { backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: 14, flexDirection: 'row', alignItems: 'center', ...shadow.card },
  serviceIcon: { width: 58, height: 58, borderRadius: 19, backgroundColor: colors.dark, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  serviceIconText: { color: colors.white, fontSize: 24, fontWeight: '900' },
  serviceName: { color: colors.text, fontSize: 16, fontWeight: '900' },
  serviceMeta: { color: colors.muted, fontSize: 11, marginTop: 4 },
  section: { fontSize: 17, fontWeight: '900', color: colors.text, marginTop: 26, marginBottom: 12 },
  dateCard: { width: 75, paddingVertical: 12, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', marginRight: 9 },
  dateActive: { backgroundColor: colors.primary, borderColor: colors.primary, ...shadow.card },
  dateDay: { color: colors.muted, textTransform: 'uppercase', fontSize: 10, fontWeight: '900' },
  dateNum: { fontSize: 23, color: colors.text, fontWeight: '900', marginTop: 3 },
  dateMonth: { color: colors.muted, fontSize: 10, marginTop: 3, textTransform: 'uppercase' },
  dateTextActive: { color: colors.white },
  slotLoading: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 18, borderWidth: 1, borderColor: colors.border },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: { width: '30%', minHeight: 68, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  slotActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  slotDisabled: { opacity: 0.42 },
  slotText: { color: colors.text, fontWeight: '900', fontSize: 13 },
  slotTextActive: { color: colors.primaryDark },
  slotCaption: { fontSize: 10, color: colors.muted, marginTop: 3 },
  muted: { color: colors.muted, fontSize: 12 },
});

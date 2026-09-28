import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, InfoBanner, Pill, Screen } from '@/src/components/ui';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { getService } from '@/src/services/api';
import type { Service } from '@/src/types';

export default function ServiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const router = useRouter(); const [service, setService] = useState<Service | null>(null);
  useEffect(() => { getService(String(id)).then(setService).catch(() => undefined); }, [id]);
  if (!service) return <Screen><ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} /></Screen>;
  return <Screen padded={false}><ScrollView contentContainerStyle={styles.content}>
    <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹</Text><Text style={styles.backLabel}>Voltar</Text></Pressable>
    <View style={styles.hero}><View style={styles.heroBadge}><Text style={styles.heroIcon}>✦</Text></View><Text style={styles.heroCategory}>{service.categoria}</Text><Text style={styles.heroTitle}>{service.nome}</Text><Text style={styles.heroSub}>{service.profissional}</Text></View>
    <View style={styles.infoRow}><View style={styles.meta}><Text style={styles.metaIcon}>◷</Text><Text style={styles.metaTitle}>{service.duracaoMinutos} min</Text><Text style={styles.metaLabel}>Duração</Text></View><View style={styles.meta}><Text style={styles.metaIcon}>⌖</Text><Text style={styles.metaTitle} numberOfLines={1}>{service.local}</Text><Text style={styles.metaLabel}>Local</Text></View><View style={styles.meta}><Text style={styles.metaIcon}>✓</Text><Text style={styles.metaTitle}>Online</Text><Text style={styles.metaLabel}>Reserva</Text></View></View>
    <Text style={styles.section}>Sobre o serviço</Text><Text style={styles.description}>{service.descricao}</Text>
    <InfoBanner title="Processamento assíncrono" description="Após a solicitação, a API registra o agendamento e o backend processa a confirmação por mensageria antes de atualizar seu status." icon="↗" tone="info" />
    <Button title="Escolher data e horário" onPress={() => router.push({ pathname: '/booking', params: { serviceId: service.id } })} icon="→" />
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: 18, paddingBottom: 110 },
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: colors.primary, fontSize: 28, lineHeight: 28, marginRight: 4 },
  backLabel: { color: colors.text, fontWeight: '900', fontSize: 13 },
  hero: { minHeight: 270, borderRadius: 28, backgroundColor: colors.dark, padding: 22, justifyContent: 'flex-end', overflow: 'hidden', ...shadow.card },
  heroBadge: { position: 'absolute', top: 24, right: 24, width: 66, height: 66, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  heroIcon: { color: colors.white, fontSize: 30, fontWeight: '900' },
  heroCategory: { color: '#B7B1FF', fontSize: 10, fontWeight: '900', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroTitle: { color: colors.white, fontSize: 29, lineHeight: 34, fontWeight: '900', marginTop: 6, maxWidth: 280 },
  heroSub: { color: '#C4C7D5', fontSize: 12, marginTop: 5 },
  infoRow: { flexDirection: 'row', gap: 9, marginTop: 12 },
  meta: { flex: 1, backgroundColor: colors.surface, borderRadius: 17, borderWidth: 1, borderColor: colors.border, padding: 12 },
  metaIcon: { color: colors.primary, fontSize: 17 },
  metaTitle: { color: colors.text, fontSize: 11, fontWeight: '900', marginTop: 9 },
  metaLabel: { color: colors.muted, fontSize: 9, marginTop: 2 },
  section: { fontSize: 18, fontWeight: '900', color: colors.text, marginTop: 24, marginBottom: 8 },
  description: { color: colors.muted, fontSize: 13, lineHeight: 21 },
});

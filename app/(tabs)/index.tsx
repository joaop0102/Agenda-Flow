import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { EmptyState, Screen, SectionTitle } from '@/src/components/ui';
import { ServiceCard } from '@/src/components/ServiceCard';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { getServices } from '@/src/services/api';
import type { Service } from '@/src/types';
import { useAuth } from '@/src/context/AuthContext';

export default function ServicesScreen() {
  const { user } = useAuth(); const router = useRouter();
  const [services, setServices] = useState<Service[]>([]); const [category, setCategory] = useState('Todos'); const [loading, setLoading] = useState(true); const [refreshing, setRefreshing] = useState(false);
  const categories = useMemo(() => ['Todos', ...Array.from(new Set(services.map((s) => s.categoria)))], [services]);
  const load = useCallback(async (refresh = false) => { refresh ? setRefreshing(true) : setLoading(true); try { setServices(await getServices()); } finally { setLoading(false); setRefreshing(false); } }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  const visible = category === 'Todos' ? services : services.filter((s) => s.categoria === category);

  const header = <View>
    <View style={styles.topRow}><View><Text style={styles.kicker}>AGENDAFLOW</Text><Text style={styles.greeting}>Olá, {user?.nome?.split(' ')[0] || 'cliente'}.</Text></View><View style={styles.profileMini}><Text style={styles.profileMiniText}>{user?.nome?.slice(0, 1).toUpperCase() || 'A'}</Text></View></View>
    <View style={styles.hero}>
      <View style={{ flex: 1 }}><View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>AGENDA EM TEMPO REAL</Text></View><Text style={styles.heroTitle}>Seu próximo horário começa aqui.</Text><Text style={styles.heroText}>Encontre um serviço e escolha o melhor momento para você.</Text></View>
      <View style={styles.heroArt}><Text style={styles.heroArtIcon}>✦</Text><View style={styles.heroArtLine} /><View style={styles.heroArtLineShort} /></View>
    </View>
    <SectionTitle title="Categorias" icon="⌘" />
    <FlatList data={categories} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} keyExtractor={(x) => x} renderItem={({ item }) => <Pressable onPress={() => setCategory(item)} style={[styles.cat, category === item && styles.catActive]}><Text style={[styles.catText, category === item && styles.catTextActive]}>{item}</Text></Pressable>} />
    <SectionTitle title="Serviços disponíveis" icon="✦" />
    {loading ? <View style={styles.loader}><ActivityIndicator color={colors.primary} /><Text style={styles.loaderText}>Carregando serviços...</Text></View> : null}
  </View>;

  return <Screen padded={false}><FlatList data={visible} keyExtractor={(x) => x.id} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />} contentContainerStyle={styles.content} ListHeaderComponent={header} renderItem={({ item }) => <ServiceCard service={item} onPress={() => router.push({ pathname: '/service/[id]', params: { id: item.id } })} />} ListEmptyComponent={!loading ? <EmptyState icon="✦" title="Nenhum serviço encontrado" description="Tente outra categoria ou atualize a lista." /> : null} /></Screen>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: 16, paddingBottom: 110 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  kicker: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
  greeting: { color: colors.text, fontSize: 25, fontWeight: '900', marginTop: 3 },
  profileMini: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E1DDFF' },
  profileMiniText: { color: colors.primaryDark, fontSize: 16, fontWeight: '900' },
  hero: { backgroundColor: colors.dark, borderRadius: radius.xl, padding: 19, flexDirection: 'row', minHeight: 180, marginBottom: 24, ...shadow.card },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  liveText: { color: '#BDEEDC', fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  heroTitle: { color: colors.white, fontSize: 25, lineHeight: 30, fontWeight: '900', marginTop: 10, maxWidth: 230 },
  heroText: { color: '#C6C9D6', fontSize: 12, lineHeight: 18, marginTop: 8, maxWidth: 225 },
  heroArt: { width: 72, height: 136, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '5deg' }], marginTop: 2 },
  heroArtIcon: { color: colors.white, fontSize: 31, fontWeight: '900' },
  heroArtLine: { width: 30, height: 5, borderRadius: 5, backgroundColor: '#B4ACFF', marginTop: 18 },
  heroArtLineShort: { width: 20, height: 5, borderRadius: 5, backgroundColor: '#8E84F4', marginTop: 7 },
  cat: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  catActive: { backgroundColor: colors.primary, borderColor: colors.primary, ...shadow.card },
  catText: { color: colors.muted, fontWeight: '800', fontSize: 12 },
  catTextActive: { color: colors.white },
  loader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  loaderText: { color: colors.muted, fontSize: 12 },
});

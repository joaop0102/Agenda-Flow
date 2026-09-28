import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Service } from '@/src/types';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { Pill } from '@/src/components/ui';

export function ServiceCard({ service, onPress }: { service: Service; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { transform: [{ scale: pressed ? 0.985 : 1 }], opacity: pressed ? 0.96 : 1 }]}>
      <View style={styles.visual}>
        <View style={styles.visualCircle}><Text style={styles.visualIcon}>✦</Text></View>
        <Text style={styles.visualLabel}>{service.categoria}</Text>
      </View>
      <View style={styles.body}>
        <Pill text={service.categoria} />
        <Text style={styles.name} numberOfLines={1}>{service.nome}</Text>
        <Text style={styles.description} numberOfLines={2}>{service.descricao}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>◷ {service.duracaoMinutos} min</Text>
          <Text style={styles.meta} numberOfLines={1}>● {service.profissional}</Text>
        </View>
        <View style={styles.footer}><Text style={styles.footerText}>Ver horários</Text><Text style={styles.arrow}>→</Text></View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, padding: 12, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  visual: { width: 92, minHeight: 160, borderRadius: 18, backgroundColor: colors.dark, padding: 10, justifyContent: 'space-between', alignItems: 'center' },
  visualCircle: { width: 52, height: 52, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  visualIcon: { color: colors.white, fontSize: 25, fontWeight: '900' },
  visualLabel: { color: '#DAD9FF', fontSize: 10, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase', marginBottom: 5 },
  body: { flex: 1, paddingLeft: 13, paddingRight: 3, paddingVertical: 2 },
  name: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 8 },
  description: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 4 },
  metaRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  meta: { color: colors.muted, fontSize: 11, fontWeight: '700', flexShrink: 1 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  footerText: { color: colors.primaryDark, fontSize: 12, fontWeight: '900' },
  arrow: { color: colors.primary, fontSize: 18, fontWeight: '900' },
});

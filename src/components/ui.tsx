import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';

export function Screen({ children, padded = true }: PropsWithChildren<{ padded?: boolean }>) {
  return <View style={[styles.screen, padded && styles.padded]}>{children}</View>;
}

export function Card({ children, style }: PropsWithChildren<{ style?: object }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.brandMark, compact && styles.brandMarkCompact]}>
      <Text style={[styles.brandMarkText, compact && styles.brandMarkTextCompact]}>AF</Text>
    </View>
  );
}

export function Button({ title, onPress, loading = false, variant = 'primary', disabled = false, icon }: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  disabled?: boolean;
  icon?: string;
}) {
  const palette = {
    primary: { background: colors.primary, border: colors.primary, text: colors.white },
    secondary: { background: colors.primarySoft, border: colors.primarySoft, text: colors.primaryDark },
    ghost: { background: 'transparent', border: colors.border, text: colors.text },
    danger: { background: colors.dangerSoft, border: colors.dangerSoft, text: colors.danger },
    success: { background: colors.accentSoft, border: colors.accentSoft, text: colors.success },
  }[variant];
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.background, borderColor: palette.border, opacity: pressed || disabled ? 0.72 : 1 },
        variant === 'primary' && shadow.card,
      ]}
    >
      {loading ? <ActivityIndicator color={palette.text} /> : <View style={styles.buttonInner}>{icon ? <Text style={[styles.buttonIcon, { color: palette.text }]}>{icon}</Text> : null}<Text style={[styles.buttonText, { color: palette.text }]}>{title}</Text></View>}
    </Pressable>
  );
}

export function Input({ label, error, leftIcon, ...props }: ComponentProps<typeof TextInput> & { label: string; error?: string; leftIcon?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        {leftIcon ? <Text style={styles.inputIcon}>{leftIcon}</Text> : null}
        <TextInput placeholderTextColor={colors.subtle} {...props} style={[styles.input, leftIcon && { paddingLeft: 0 }]} />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function SectionTitle({ title, action, icon }: { title: string; action?: string; icon?: string }) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionTitleWrap}>{icon ? <Text style={styles.sectionIcon}>{icon}</Text> : null}<Text style={styles.sectionTitle}>{title}</Text></View>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

export function Pill({ text, tone = 'blue', icon }: { text: string; tone?: 'blue' | 'green' | 'gray' | 'red' | 'orange'; icon?: string }) {
  const map = {
    blue: [colors.primarySoft, colors.primaryDark],
    green: [colors.accentSoft, colors.success],
    gray: ['#F2F4F7', colors.muted],
    red: [colors.dangerSoft, colors.danger],
    orange: [colors.warningSoft, colors.warning],
  } as const;
  return <View style={[styles.pill, { backgroundColor: map[tone][0] }]}>{icon ? <Text style={{ color: map[tone][1], fontSize: 11, marginRight: 4 }}>{icon}</Text> : null}<Text style={{ color: map[tone][1], fontWeight: '800', fontSize: 11 }}>{text}</Text></View>;
}

export function EmptyState({ icon = '◌', title, description }: { icon?: string; title: string; description?: string }) {
  return <Card style={styles.emptyCard}><Text style={styles.emptyIcon}>{icon}</Text><Text style={styles.emptyTitle}>{title}</Text>{description ? <Text style={styles.emptyText}>{description}</Text> : null}</Card>;
}

export function InfoBanner({ title, description, icon = 'i', tone = 'info' }: { title: string; description: string; icon?: string; tone?: 'info' | 'warning' | 'success' }) {
  const map = {
    info: { bg: colors.infoSoft, icon: colors.info, text: '#214575' },
    warning: { bg: colors.warningSoft, icon: colors.warning, text: '#7A4E0A' },
    success: { bg: colors.accentSoft, icon: colors.success, text: '#155E47' },
  } as const;
  const palette = map[tone];
  return <View style={[styles.infoBanner, { backgroundColor: palette.bg }]}><View style={[styles.infoIcon, { backgroundColor: `${palette.icon}18` }]}><Text style={[styles.infoIconText, { color: palette.icon }]}>{icon}</Text></View><View style={{ flex: 1 }}><Text style={[styles.infoTitle, { color: palette.text }]}>{title}</Text><Text style={[styles.infoText, { color: palette.text }]}>{description}</Text></View></View>;
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  padded: { paddingHorizontal: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  brandMark: { width: 64, height: 64, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  brandMarkCompact: { width: 42, height: 42, borderRadius: 14 },
  brandMarkText: { color: colors.white, fontSize: 23, fontWeight: '900', letterSpacing: -1 },
  brandMarkTextCompact: { fontSize: 16 },
  button: { minHeight: 54, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, marginTop: spacing.sm },
  buttonInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonIcon: { fontSize: 16 },
  buttonText: { fontSize: 15, fontWeight: '900', letterSpacing: 0.1 },
  field: { marginBottom: spacing.md },
  label: { fontSize: 12, fontWeight: '900', color: colors.text, marginBottom: 8 },
  inputWrap: { minHeight: 54, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center' },
  inputIcon: { fontSize: 16, color: colors.subtle, marginLeft: 14, marginRight: 10 },
  input: { flex: 1, color: colors.text, fontSize: 15, paddingHorizontal: spacing.md, minHeight: 52 },
  error: { color: colors.danger, marginTop: 6, fontSize: 12, fontWeight: '600' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionIcon: { fontSize: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  action: { color: colors.primaryDark, fontWeight: '800' },
  pill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  emptyCard: { alignItems: 'center', padding: 34, marginTop: 10 },
  emptyIcon: { fontSize: 34, color: colors.primary },
  emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 16, marginTop: 10 },
  emptyText: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 5, maxWidth: 260 },
  infoBanner: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.md, marginTop: 16 },
  infoIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  infoIconText: { fontSize: 15, fontWeight: '900' },
  infoTitle: { fontSize: 12, fontWeight: '900' },
  infoText: { fontSize: 12, lineHeight: 18, marginTop: 3 },
});

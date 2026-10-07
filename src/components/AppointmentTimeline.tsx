import { StyleSheet, Text, View } from 'react-native';
import type { AppointmentStatus } from '@/src/types';
import { colors, spacing, radius } from '@/src/constants/theme';

const steps = [
  { key: 'PROCESSANDO' as const, label: 'Solicitação recebida', icon: '01' },
  { key: 'CONFIRMADO' as const, label: 'Horário confirmado', icon: '02' },
];

export function AppointmentTimeline({ status, motivo }: { status: AppointmentStatus; motivo?: string | null }) {
  if (status === 'CANCELADO' || status === 'REJEITADO') {
    const rejeitado = status === 'REJEITADO';
    return <View style={styles.cancel}><View style={styles.statusIcon}><Text style={styles.statusIconText}>!</Text></View><View style={{ flex: 1 }}><Text style={styles.cancelTitle}>{rejeitado ? 'Horário indisponível' : 'Agendamento cancelado'}</Text><Text style={styles.cancelText}>{rejeitado ? `${motivo || 'Outra solicitação ficou com este horário.'} Escolha outra data ou horário.` : 'Este agendamento foi cancelado e o horário voltou a ficar livre.'}</Text></View></View>;
  }

  const current = steps.findIndex((s) => s.key === status);
  return (
    <View style={styles.box}>
      <Text style={styles.heading}>Status da solicitação</Text>
      {steps.map((step, index) => {
        const done = index <= current;
        return <View key={step.key} style={styles.row}>
          <View style={styles.left}>
            <View style={[styles.dot, done && styles.dotDone]}><Text style={[styles.dotText, done && styles.dotTextDone]}>{done ? '✓' : step.icon}</Text></View>
            {index < steps.length - 1 ? <View style={[styles.line, current > index && styles.lineDone]} /> : null}
          </View>
          <View style={styles.content}>
            <Text style={[styles.label, done && styles.labelDone]}>{step.label}</Text>
            <Text style={styles.caption}>{step.key === status ? 'Status atual' : done ? 'Concluído' : 'Aguardando processamento'}</Text>
          </View>
        </View>;
      })}
      <View style={styles.note}><Text style={styles.noteIcon}>↗</Text><Text style={styles.noteText}>A confirmação pode aparecer alguns segundos depois porque o pedido passa por um fluxo assíncrono.</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  heading: { color: colors.text, fontSize: 14, fontWeight: '900', marginBottom: 18 },
  row: { flexDirection: 'row', minHeight: 72 },
  left: { width: 42, alignItems: 'center' },
  dot: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#F2F4F7', alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.primarySoft },
  dotText: { color: colors.subtle, fontSize: 11, fontWeight: '900' },
  dotTextDone: { color: colors.primaryDark, fontSize: 15 },
  line: { flex: 1, width: 2, backgroundColor: '#E4E7EC', marginVertical: 4 },
  lineDone: { backgroundColor: colors.primary },
  content: { paddingLeft: 10, paddingTop: 1, flex: 1 },
  label: { color: colors.muted, fontSize: 14, fontWeight: '800' },
  labelDone: { color: colors.text },
  caption: { color: colors.subtle, fontSize: 11, marginTop: 4 },
  note: { flexDirection: 'row', gap: 8, backgroundColor: colors.infoSoft, padding: 11, borderRadius: 13, marginTop: 6 },
  noteIcon: { color: colors.info, fontWeight: '900' },
  noteText: { color: '#284A78', fontSize: 11, lineHeight: 16, flex: 1 },
  cancel: { flexDirection: 'row', gap: 12, backgroundColor: colors.dangerSoft, padding: spacing.md, borderRadius: radius.md },
  statusIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#FFFFFF99', alignItems: 'center', justifyContent: 'center' },
  statusIconText: { color: colors.danger, fontWeight: '900', fontSize: 16 },
  cancelTitle: { color: colors.danger, fontWeight: '900', fontSize: 15 },
  cancelText: { color: '#7F1D1D', marginTop: 4, fontSize: 11, lineHeight: 17 },
});

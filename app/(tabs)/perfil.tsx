import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Pill, Screen, SectionTitle } from '@/src/components/ui';
import { colors, radius, spacing } from '@/src/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { confirmar } from '@/src/lib/dialog';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.kicker}>CONTA</Text><Text style={styles.title}>Meu perfil</Text>
    <Card style={styles.profileCard}><View style={styles.profileTop}><View style={styles.avatar}><Text style={styles.avatarText}>{user?.nome?.slice(0, 1).toUpperCase() || 'A'}</Text></View><View style={{ flex: 1, marginLeft: 14 }}><Text style={styles.name}>{user?.nome}</Text><Text style={styles.email}>{user?.email}</Text><Pill text={user?.role || 'COMUM'} tone={user?.role === 'ADMIN' ? 'blue' : 'gray'} /></View></View><View style={styles.line} /><View style={styles.stats}><View><Text style={styles.statValue}>AF</Text><Text style={styles.statLabel}>Perfil ativo</Text></View><View style={styles.statDivider} /><View><Text style={styles.statValue}>24/7</Text><Text style={styles.statLabel}>Acesso</Text></View></View></Card>
    <SectionTitle title="Sobre o AgendaFlow" icon="i" />
    <View style={styles.info}><View style={styles.infoIcon}><Text style={styles.infoIconText}>↗</Text></View><View style={{ flex: 1 }}><Text style={styles.infoTitle}>Fluxo assíncrono</Text><Text style={styles.infoText}>O app conversa com o Gateway por HTTP. O agendamento é processado pelos microsserviços do backend, com RabbitMQ, banco de dados e transação para lidar com concorrência.</Text></View></View>
    <Button title="Encerrar sessão" variant="danger" onPress={() => confirmar('Sair', 'Deseja encerrar a sessão?', () => void signOut(), 'Sair')} />
  </ScrollView></Screen>;
}
const styles = StyleSheet.create({
  content: { paddingBottom: 110 },
  kicker: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  title: { fontSize: 29, fontWeight: '900', color: colors.text, marginTop: 4, marginBottom: 20 },
  profileCard: { padding: 18, borderRadius: radius.xl },
  profileTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 66, height: 66, borderRadius: 22, backgroundColor: colors.dark, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontSize: 25, fontWeight: '900' },
  name: { color: colors.text, fontWeight: '900', fontSize: 19 },
  email: { color: colors.muted, marginTop: 3, marginBottom: 8, fontSize: 12 },
  line: { height: 1, backgroundColor: colors.border, marginVertical: 18 },
  stats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 34 },
  statValue: { color: colors.primaryDark, fontWeight: '900', fontSize: 16 },
  statLabel: { color: colors.muted, fontSize: 10, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: colors.border },
  info: { flexDirection: 'row', gap: 12, backgroundColor: colors.infoSoft, borderRadius: radius.md, padding: 15, marginBottom: 18 },
  infoIcon: { width: 36, height: 36, borderRadius: 13, backgroundColor: '#DDEBFF', alignItems: 'center', justifyContent: 'center' },
  infoIconText: { color: colors.info, fontWeight: '900', fontSize: 17 },
  infoTitle: { color: '#284A78', fontWeight: '900', fontSize: 12 },
  infoText: { color: '#284A78', fontSize: 11, lineHeight: 17, marginTop: 3 },
});

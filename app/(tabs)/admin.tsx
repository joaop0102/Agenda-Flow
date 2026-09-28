import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Input, Screen, SectionTitle } from '@/src/components/ui';
import { colors, radius, spacing } from '@/src/constants/theme';
import { createService } from '@/src/services/api';

export default function AdminScreen() {
  const [nome, setNome] = useState(''); const [descricao, setDescricao] = useState(''); const [duracao, setDuracao] = useState('60'); const [categoria, setCategoria] = useState('Serviços'); const [profissional, setProfissional] = useState(''); const [local, setLocal] = useState(''); const [loading, setLoading] = useState(false);
  async function save() { if (!nome || !descricao || !profissional || !local) return Alert.alert('Preencha os campos', 'Complete os dados do serviço.'); setLoading(true); try { await createService({ nome, descricao, duracaoMinutos: Number(duracao) || 60, categoria, profissional, local, ativo: true }); Alert.alert('Tudo certo', 'Serviço cadastrado com sucesso.'); setNome(''); setDescricao(''); setProfissional(''); setLocal(''); } catch (e) { Alert.alert('Erro', e instanceof Error ? e.message : 'Não foi possível cadastrar.'); } finally { setLoading(false); } }
  return <Screen padded={false}><ScrollView contentContainerStyle={styles.content}><View style={styles.hero}><View style={styles.heroIcon}><Text style={styles.heroIconText}>✦</Text></View><Text style={styles.kicker}>PAINEL ADMINISTRATIVO</Text><Text style={styles.title}>Novo serviço</Text><Text style={styles.subtitle}>Cadastre opções que ficarão disponíveis para agendamento.</Text></View><SectionTitle title="Informações do serviço" icon="✎" /><Input label="Nome do serviço" value={nome} onChangeText={setNome} placeholder="Ex.: Corte Masculino" leftIcon="✦" /><Input label="Descrição" value={descricao} onChangeText={setDescricao} multiline placeholder="Descreva o serviço" leftIcon="≡" /><View style={styles.row}><View style={{ flex: 1 }}><Input label="Duração" value={duracao} onChangeText={setDuracao} keyboardType="number-pad" leftIcon="◷" /></View><View style={{ width: 12 }} /><View style={{ flex: 1 }}><Input label="Categoria" value={categoria} onChangeText={setCategoria} placeholder="Beleza" leftIcon="⌁" /></View></View><Input label="Profissional" value={profissional} onChangeText={setProfissional} placeholder="Nome do profissional" leftIcon="○" /><Input label="Local" value={local} onChangeText={setLocal} placeholder="Unidade Centro" leftIcon="⌖" /><Button title="Cadastrar serviço" onPress={save} loading={loading} icon="✓" /></ScrollView></Screen>;
}
const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: 18, paddingBottom: 110 },
  hero: { backgroundColor: colors.dark, borderRadius: radius.xl, padding: 20, marginBottom: 24 },
  heroIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  heroIconText: { color: colors.white, fontSize: 20, fontWeight: '900' },
  kicker: { color: '#B7B1FF', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  title: { color: colors.white, fontSize: 27, fontWeight: '900', marginTop: 4 },
  subtitle: { color: '#C5C8D5', fontSize: 12, lineHeight: 18, marginTop: 5, maxWidth: 300 },
  row: { flexDirection: 'row' },
});

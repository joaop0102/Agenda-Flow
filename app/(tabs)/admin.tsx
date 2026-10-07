import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, EmptyState, Input, Pill, Screen, SectionTitle } from '@/src/components/ui';
import { colors, radius, spacing } from '@/src/constants/theme';
import { notify } from '@/src/lib/dialog';
import { formatBRL } from '@/src/lib/format';
import { createService, getMonthlyReport, getMonthSlots, getServices, openSlots, removeSlot } from '@/src/services/api';
import type { MonthlyReport, Service, SlotAdmin } from '@/src/types';

type Aba = 'servico' | 'horarios' | 'relatorio';
const ABAS: { key: Aba; label: string }[] = [{ key: 'servico', label: 'Serviço' }, { key: 'horarios', label: 'Horários' }, { key: 'relatorio', label: 'Relatório' }];

function dataLocal(deslocamentoDias = 0) {
  const d = new Date(); d.setDate(d.getDate() + deslocamentoDias);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function erro(e: unknown, padrao: string) { return e instanceof Error ? e.message : padrao; }

export default function AdminScreen() {
  const [aba, setAba] = useState<Aba>('servico');
  return <Screen padded={false}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.hero}><View style={styles.heroIcon}><Text style={styles.heroIconText}>✦</Text></View><Text style={styles.kicker}>PAINEL ADMINISTRATIVO</Text><Text style={styles.title}>Gestão</Text><Text style={styles.subtitle}>Cadastre serviços, abra horários e acompanhe o faturamento do mês.</Text></View>
    <View style={styles.tabs}>{ABAS.map((a) => <Pressable key={a.key} onPress={() => setAba(a.key)} style={[styles.tab, aba === a.key && styles.tabActive]}><Text style={[styles.tabText, aba === a.key && styles.tabTextActive]}>{a.label}</Text></Pressable>)}</View>
    {aba === 'servico' ? <NovoServico /> : aba === 'horarios' ? <Horarios /> : <Relatorio />}
  </ScrollView></Screen>;
}

function NovoServico() {
  const [nome, setNome] = useState(''); const [descricao, setDescricao] = useState(''); const [duracao, setDuracao] = useState('60'); const [categoria, setCategoria] = useState('Serviços'); const [profissional, setProfissional] = useState(''); const [local, setLocal] = useState(''); const [preco, setPreco] = useState('30'); const [loading, setLoading] = useState(false);
  async function save() {
    const valor = Number(preco.replace(',', '.'));
    if (!nome || !descricao || !profissional || !local) return notify('Preencha os campos', 'Complete os dados do serviço.');
    if (!Number.isFinite(valor) || valor < 0) return notify('Preço inválido', 'Informe um valor como 30 ou 30,50.');
    setLoading(true);
    try { await createService({ nome, descricao, duracaoMinutos: Number(duracao) || 60, categoria, profissional, local, preco: valor, ativo: true }); notify('Tudo certo', 'Serviço cadastrado com sucesso.'); setNome(''); setDescricao(''); setProfissional(''); setLocal(''); }
    catch (e) { notify('Erro', erro(e, 'Não foi possível cadastrar.')); }
    finally { setLoading(false); }
  }
  return <View>
    <SectionTitle title="Informações do serviço" icon="✎" />
    <Input label="Nome do serviço" value={nome} onChangeText={setNome} placeholder="Ex.: Corte Masculino" leftIcon="✦" />
    <Input label="Descrição" value={descricao} onChangeText={setDescricao} multiline placeholder="Descreva o serviço" leftIcon="≡" />
    <View style={styles.row}><View style={{ flex: 1 }}><Input label="Duração (min)" value={duracao} onChangeText={setDuracao} keyboardType="number-pad" leftIcon="◷" /></View><View style={{ width: 12 }} /><View style={{ flex: 1 }}><Input label="Preço (R$)" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" leftIcon="$" /></View></View>
    <Input label="Categoria" value={categoria} onChangeText={setCategoria} placeholder="Beleza" leftIcon="⌁" />
    <Input label="Profissional" value={profissional} onChangeText={setProfissional} placeholder="Nome do profissional" leftIcon="○" />
    <Input label="Local" value={local} onChangeText={setLocal} placeholder="Unidade Centro" leftIcon="⌖" />
    <Button title="Cadastrar serviço" onPress={save} loading={loading} icon="✓" />
  </View>;
}

function Horarios() {
  const [servicos, setServicos] = useState<Service[]>([]); const [servicoId, setServicoId] = useState('');
  const [data, setData] = useState(dataLocal(1)); const [horas, setHoras] = useState('09:00, 10:00, 11:00');
  const [lista, setLista] = useState<SlotAdmin[]>([]); const [loading, setLoading] = useState(false);
  const mes = data.slice(0, 7);

  useEffect(() => { getServices().then((s) => { setServicos(s); if (s.length > 0) setServicoId((atual) => atual || s[0].id); }).catch((e) => notify('Erro', erro(e, 'Não foi possível listar os serviços.'))); }, []);
  const carregar = useCallback(async () => {
    if (!servicoId || !/^\d{4}-\d{2}$/.test(mes)) return;
    try { setLista(await getMonthSlots(servicoId, mes)); } catch (e) { setLista([]); notify('Erro', erro(e, 'Não foi possível listar os horários.')); }
  }, [servicoId, mes]);
  useEffect(() => { carregar(); }, [carregar]);

  async function abrir() {
    const lote = horas.split(',').map((h) => h.trim()).filter(Boolean);
    if (!servicoId) return notify('Escolha um serviço', 'Selecione o serviço que terá horários.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return notify('Data inválida', 'Use o formato AAAA-MM-DD, por exemplo 2026-10-20.');
    if (lote.length === 0) return notify('Informe os horários', 'Ex.: 09:00, 10:30');
    setLoading(true);
    try { await openSlots(servicoId, data, lote); await carregar(); notify('Horários abertos', `${lote.length} horário(s) em ${data}.`); }
    catch (e) { notify('Erro', erro(e, 'Não foi possível abrir os horários.')); }
    finally { setLoading(false); }
  }
  async function remover(slot: SlotAdmin) {
    try { await removeSlot(slot.id); await carregar(); } catch (e) { notify('Não foi possível remover', erro(e, 'Tente novamente.')); }
  }

  return <View>
    <SectionTitle title="Abrir dia para agendamento" icon="◷" />
    <Text style={styles.label}>Serviço</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>{servicos.map((s) => <Pressable key={s.id} onPress={() => setServicoId(s.id)} style={[styles.chip, servicoId === s.id && styles.chipActive]}><Text style={[styles.chipText, servicoId === s.id && styles.chipTextActive]}>{s.nome}</Text></Pressable>)}</ScrollView>
    <Input label="Data (AAAA-MM-DD)" value={data} onChangeText={setData} autoCapitalize="none" placeholder="2026-10-20" leftIcon="◷" />
    <Input label="Horários (separados por vírgula)" value={horas} onChangeText={setHoras} autoCapitalize="none" placeholder="09:00, 10:30" leftIcon="⌁" />
    <Button title="Abrir horários" onPress={abrir} loading={loading} icon="✓" />
    <SectionTitle title={`Horários de ${mes}`} icon="≡" />
    {lista.length === 0 ? <EmptyState icon="◌" title="Nenhum horário neste mês" description="Abra um dia acima para os clientes poderem agendar." /> : lista.map((slot) => <Card key={slot.id} style={styles.slotRow}>
      <View style={{ flex: 1 }}><Text style={styles.slotTitle}>{slot.data.split('-').reverse().join('/')} às {slot.hora}</Text>{slot.agendamentoId ? <Text style={styles.slotMeta}>Agendamento {slot.agendamentoId}</Text> : null}</View>
      <Pill text={slot.status} tone={slot.status === 'DISPONIVEL' ? 'green' : 'orange'} />
      {slot.status === 'DISPONIVEL' ? <Pressable onPress={() => remover(slot)} style={styles.remove}><Text style={styles.removeText}>✕</Text></Pressable> : null}
    </Card>)}
  </View>;
}

function Relatorio() {
  const [mes, setMes] = useState(dataLocal().slice(0, 7)); const [relatorio, setRelatorio] = useState<MonthlyReport | null>(null); const [loading, setLoading] = useState(false);
  async function gerar() {
    if (!/^\d{4}-\d{2}$/.test(mes)) return notify('Mês inválido', 'Use o formato AAAA-MM, por exemplo 2026-10.');
    setLoading(true);
    try { setRelatorio(await getMonthlyReport(mes)); } catch (e) { setRelatorio(null); notify('Erro', erro(e, 'Não foi possível gerar o relatório.')); } finally { setLoading(false); }
  }
  return <View>
    <SectionTitle title="Relatório mensal" icon="↗" />
    <Input label="Mês (AAAA-MM)" value={mes} onChangeText={setMes} autoCapitalize="none" placeholder="2026-10" leftIcon="◷" />
    <Button title="Gerar relatório" onPress={gerar} loading={loading} icon="→" />
    {relatorio ? <View style={{ marginTop: 18 }}>
      <Card style={styles.total}><Text style={styles.totalLabel}>Faturamento de {relatorio.mes}</Text><Text style={styles.totalValue}>{formatBRL(relatorio.valorTotal)}</Text><Text style={styles.totalLabel}>{relatorio.quantidadeTotal} agendamento(s) confirmado(s)</Text></Card>
      {relatorio.porServico.length === 0 ? <EmptyState icon="◌" title="Sem agendamentos confirmados" description="Nenhum serviço foi confirmado neste mês." /> : relatorio.porServico.map((s) => <Card key={s.servicoId} style={styles.slotRow}><View style={{ flex: 1 }}><Text style={styles.slotTitle}>{s.servicoNome}</Text><Text style={styles.slotMeta}>{s.quantidade} × confirmado(s)</Text></View><Text style={styles.slotTitle}>{formatBRL(s.valorTotal)}</Text></Card>)}
    </View> : null}
  </View>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: 18, paddingBottom: 110 },
  hero: { backgroundColor: colors.dark, borderRadius: radius.xl, padding: 20, marginBottom: 18 },
  heroIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  heroIconText: { color: colors.white, fontSize: 20, fontWeight: '900' },
  kicker: { color: '#B7B1FF', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  title: { color: colors.white, fontSize: 27, fontWeight: '900', marginTop: 4 },
  subtitle: { color: '#C5C8D5', fontSize: 12, lineHeight: 18, marginTop: 5, maxWidth: 300 },
  row: { flexDirection: 'row' },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  tab: { flex: 1, paddingVertical: 11, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.muted, fontWeight: '800', fontSize: 12 },
  tabTextActive: { color: colors.white },
  label: { color: colors.muted, fontSize: 11, fontWeight: '800', marginBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  chipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '800', fontSize: 12 },
  chipTextActive: { color: colors.primaryDark },
  slotRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8, paddingVertical: 12 },
  slotTitle: { color: colors.text, fontWeight: '800', fontSize: 13 },
  slotMeta: { color: colors.muted, fontSize: 10, marginTop: 3 },
  remove: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center' },
  removeText: { color: colors.danger, fontWeight: '900' },
  total: { backgroundColor: colors.dark, marginBottom: 12 },
  totalLabel: { color: '#C5C8D5', fontSize: 11 },
  totalValue: { color: colors.white, fontSize: 30, fontWeight: '900', marginVertical: 6 },
});

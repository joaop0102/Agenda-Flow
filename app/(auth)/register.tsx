import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { BrandMark, Button, Input, Screen } from '@/src/components/ui';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { useAuth } from '@/src/context/AuthContext';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [nome, setNome] = useState(''); const [email, setEmail] = useState(''); const [senha, setSenha] = useState(''); const [loading, setLoading] = useState(false);
  async function submit() {
    if (!nome || !email || senha.length < 6) return Alert.alert('Dados inválidos', 'Informe nome, e-mail e senha de no mínimo 6 caracteres.');
    setLoading(true);
    try { await signUp(nome, email, senha); }
    catch (e) { Alert.alert('Cadastro não realizado', e instanceof Error ? e.message : 'Não foi possível cadastrar.'); }
    finally { setLoading(false); }
  }
  return <Screen><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.head}><BrandMark compact /><View style={{ marginLeft: 12 }}><Text style={styles.brand}>Criar sua conta</Text><Text style={styles.muted}>Comece a organizar seus horários.</Text></View></View>
    <View style={styles.card}><Text style={styles.title}>Dados pessoais</Text><Text style={styles.subtitle}>Você poderá editar seus dados depois.</Text>
      <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" leftIcon="○" />
      <Input label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="voce@email.com" leftIcon="@" />
      <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="Mínimo 6 caracteres" leftIcon="•" />
      <Button title="Criar conta" onPress={submit} loading={loading} icon="✓" />
      <Link href="/(auth)/login" style={styles.link}>Já tenho uma conta</Link>
    </View>
  </ScrollView></KeyboardAvoidingView></Screen>;
}
const styles = StyleSheet.create({
  content: { paddingTop: 30, paddingBottom: 50 },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  brand: { color: colors.text, fontSize: 20, fontWeight: '900' },
  muted: { color: colors.muted, fontSize: 12, marginTop: 3 },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 20, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  title: { color: colors.text, fontSize: 22, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 12, marginTop: 4, marginBottom: 20 },
  link: { color: colors.primaryDark, fontWeight: '900', textAlign: 'center', marginTop: 17, fontSize: 13 },
});

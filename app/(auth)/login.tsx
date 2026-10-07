import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { BrandMark, Button, Input, Screen } from '@/src/components/ui';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { notify } from '@/src/lib/dialog';
import { MOCK_MODE } from '@/src/services/api';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email || !senha) return notify('Preencha os campos', 'Informe e-mail e senha.');
    setLoading(true);
    try { await signIn(email, senha); }
    catch (e) { notify('Login não realizado', e instanceof Error ? e.message : 'Não foi possível entrar.'); }
    finally { setLoading(false); }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}><BrandMark /><View style={{ flex: 1, marginLeft: 14 }}><Text style={styles.brandName}>AgendaFlow</Text><Text style={styles.brandCaption}>Seu tempo, do seu jeito.</Text></View></View>
          <View style={styles.welcome}><Text style={styles.eyebrow}>BEM-VINDO DE VOLTA</Text><Text style={styles.title}>Agende sem complicação.</Text><Text style={styles.subtitle}>Escolha um serviço, reserve seu horário e acompanhe a confirmação pelo app.</Text></View>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Entrar</Text>
            <Text style={styles.formHint}>Acesse sua agenda pessoal.</Text>
            <Input label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="voce@email.com" leftIcon="@" />
            <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="••••••" leftIcon="•" />
            <Button title="Entrar" onPress={submit} loading={loading} icon="→" />
            <Link href="/(auth)/register" style={styles.link}>Ainda não tenho conta</Link>
          </View>
          {MOCK_MODE ? <View style={styles.demo}><Text style={styles.demoTitle}>Modo demonstração</Text><Text style={styles.demoText}>Use qualquer e-mail e senha. Para testar a área admin, use um e-mail que contenha “admin”.</Text></View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 34, paddingBottom: 50 },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandName: { color: colors.text, fontSize: 20, fontWeight: '900' },
  brandCaption: { color: colors.muted, fontSize: 12, marginTop: 2 },
  welcome: { marginTop: 42, marginBottom: 22 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: 32, lineHeight: 38, fontWeight: '900', letterSpacing: -0.7, marginTop: 7 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 8, maxWidth: 340 },
  formCard: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 20, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  formTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  formHint: { color: colors.muted, fontSize: 12, marginTop: 3, marginBottom: 20 },
  link: { color: colors.primaryDark, fontWeight: '900', textAlign: 'center', marginTop: 17, fontSize: 13 },
  demo: { marginTop: 16, backgroundColor: colors.infoSoft, borderRadius: radius.md, padding: 13 },
  demoTitle: { color: colors.info, fontWeight: '900', fontSize: 12 },
  demoText: { color: '#294A78', fontSize: 11, lineHeight: 17, marginTop: 4 },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePromo } from '../context/PromoContext';

export default function LoginScreen() {
  const { login, cadastrar } = usePromo();

  const [modoCadastro, setModoCadastro] = useState(false);
  const [isLojista, setIsLojista] = useState(false);

  // Estados dos campos do formulário
  const [nome, setNome] = useState('');
  const [nomeLoja, setNomeLoja] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleAcaoPrincipal() {
    // Validação de campos obrigatórios
    if (!email || !senha || (modoCadastro && !nome)) {
      Alert.alert(
        'Atenção',
        'Por favor, preencha todos os campos obrigatórios.'
      );
      return;
    }

    try {
      if (modoCadastro) {
        if (isLojista && !nomeLoja) {
          Alert.alert('Atenção', 'Por favor, informe o nome da sua loja.');
          return;
        }
        // Executa o cadastro real no SQLite
        await cadastrar(nome, email, senha, isLojista, nomeLoja);
        Alert.alert(
          'Sucesso',
          'Conta criada com sucesso! Faça login para entrar.'
        );
        setModoCadastro(false);
        setSenha(''); // Limpa a senha por segurança
      } else {
        // Faz o login real validando e-mail E senha no SQLite
        await login(email, senha);
      }
    } catch (error) {
      // Se errar a senha ou o e-mail não existir, o erro do banco será exibido aqui
      Alert.alert('Erro de Autenticação', error.message);
    }
  }

  function alternarModo() {
    setModoCadastro(!modoCadastro);
    setIsLojista(false);
    setNome('');
    setNomeLoja('');
    setSenha('');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoCircle}>
          <Ionicons name="pricetag" size={36} color="#ffffff" />
        </View>

        <Text style={styles.title}>PromoLocal</Text>
        <Text style={styles.subtitle}>
          Ofertas perto de você e mais visibilidade para o comércio local.
        </Text>

        {modoCadastro && (
          <>
            {/* Seletor de Tipo de Conta */}
            <View style={styles.tipoContaContainer}>
              <Pressable
                style={[styles.tipoBtn, !isLojista && styles.tipoBtnActive]}
                onPress={() => setIsLojista(false)}>
                <Text
                  style={[
                    styles.tipoBtnText,
                    !isLojista && styles.tipoBtnTextActive,
                  ]}>
                  Sou Cliente
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tipoBtn, isLojista && styles.tipoBtnActive]}
                onPress={() => setIsLojista(true)}>
                <Text
                  style={[
                    styles.tipoBtnText,
                    isLojista && styles.tipoBtnTextActive,
                  ]}>
                  Sou Lojista
                </Text>
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Seu Nome</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Como quer ser chamado?"
              />
            </View>

            {isLojista && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome da Loja</Text>
                <TextInput
                  style={styles.input}
                  value={nomeLoja}
                  onChangeText={setNomeLoja}
                  placeholder="Ex: Horti Centro"
                />
              </View>
            )}
          </>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="••••••"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Botão Principal */}
        <Pressable style={styles.primaryButton} onPress={handleAcaoPrincipal}>
          <Ionicons
            name={modoCadastro ? 'person-add-outline' : 'log-in-outline'}
            size={20}
            color="#ffffff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.primaryButtonText}>
            {modoCadastro ? 'Finalizar Cadastro' : 'Entrar'}
          </Text>
        </Pressable>

        {/* Botão de Alternância */}
        <Pressable style={styles.ghostButton} onPress={alternarModo}>
          <Ionicons
            name={modoCadastro ? 'arrow-back-outline' : 'person-add-outline'}
            size={20}
            color="#197278"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.ghostButtonText}>
            {modoCadastro ? 'Voltar para o Login' : 'Criar cadastro'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#197278',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0f172a',
  },
  primaryButton: {
    height: 50,
    backgroundColor: '#197278',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  ghostButton: {
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#197278',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ghostButtonText: { color: '#197278', fontSize: 16, fontWeight: 'bold' },

  // Abas de seleção Cliente/Lojista no cadastro
  tipoContaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
  },
  tipoBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  tipoBtnActive: {
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipoBtnText: { color: '#64748b', fontWeight: 'bold' },
  tipoBtnTextActive: { color: '#197278' },
});

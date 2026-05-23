import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { usePromo } from '../context/PromoContext';

const CATEGORIAS = [
  'Frutas',
  'Legumes',
  'Bebidas',
  'Carnes',
  'Padaria',
  'Limpeza',
];
const UNIDADES = ['kg', 'un', 'L'];

export default function LojistaScreen() {
  const {
    usuario,
    promocoes,
    logout,
    adicionarPromocao,
    alternarStatusPromocao,
    removerPromocao,
    editarPromocao,
    salvarEnderecoLoja,
  } = usePromo();

  const [abaAtual, setAbaAtual] = useState('promocoes');

  //Controle de edição de promoção
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idPromocaoEdicao, setIdPromocaoEdicao] = useState(null);

  //Estados do Formulário de Promoção
  const [produto, setProduto] = useState('');
  const [categoria, setCategoria] = useState('Frutas');
  const [precoOriginal, setPrecoOriginal] = useState('');
  const [precoPromocional, setPrecoPromocional] = useState('');
  const [unidade, setUnidade] = useState('kg');
  const [validade, setValidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUri, setImagemUri] = useState(null);

  const [nomeLoja, setNomeLoja] = useState('');
  const [cnpj, setCnpj] = useState('12.345.678/0001-90');
  const [tipoComercio, setTipoComercio] = useState('Supermercado');
  const [cep, setCep] = useState('11310-000');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [telefone, setTelefone] = useState('(13) 98765-4321');

  //Estados do Calendário
  const [dataExibicao, setDataExibicao] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const minhasPromocoes = promocoes.filter(
    (promo) => promo.lojaNome === usuario.nomeLoja
  );

  useEffect(() => {
    if (usuario) {
      setNomeLoja(usuario.nomeLoja || '');
      if (usuario.endereco && usuario.endereco.includes(',')) {
        const partes = usuario.endereco.split(',');
        if (partes.length >= 3) {
          setRua(partes[0].trim());
          setNumero(partes[1].trim());
          setBairro(partes[2].trim());

          if (partes[3] && partes[3].includes('-')) {
            const cidadeUf = partes[3].split('-');
            setCidade(cidadeUf[0].trim());
            setUf(cidadeUf[1].trim());
          }
        }
      }
    }
  }, [usuario]);

  async function escolherImagem() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert(
        'Permissão',
        'Precisamos de acesso à galeria para adicionar a foto.'
      );
      return;
    }

    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setImagemUri(resultado.assets[0].uri);
    }
  }

  function onChangeData(event, dataSelecionada) {
    setMostrarCalendario(false);
    if (dataSelecionada) {
      setDataExibicao(dataSelecionada);
      const dia = String(dataSelecionada.getDate()).padStart(2, '0');
      const mes = String(dataSelecionada.getMonth() + 1).padStart(2, '0');
      const ano = dataSelecionada.getFullYear();
      setValidade(`${dia}/${mes}/${ano}`);
    }
  }

  function iniciarEdicao(promo) {
    setModoEdicao(true);
    setIdPromocaoEdicao(promo.id);
    setProduto(promo.produto);
    setCategoria(promo.categoria);
    setPrecoOriginal(promo.precoOriginal.toString().replace('.', ','));
    setPrecoPromocional(promo.precoPromocional.toString().replace('.', ','));
    setUnidade(promo.unidade);
    setValidade(promo.validade);
    setDescricao(promo.descricao);
    setImagemUri(promo.imagem);

    if (promo.validade && promo.validade.includes('/')) {
      const [dia, mes, ano] = promo.validade.split('/');
      setDataExibicao(new Date(`${ano}-${mes}-${dia}T12:00:00`));
    }
    setAbaAtual('nova');
  }

  function limparFormulario() {
    setProduto('');
    setPrecoOriginal('');
    setPrecoPromocional('');
    setValidade('');
    setDescricao('');
    setImagemUri(null);
    setUnidade('kg');
    setCategoria('Frutas');
    setModoEdicao(false);
    setIdPromocaoEdicao(null);
    setDataExibicao(new Date());
  }

  async function handleSalvarLoja() {
    if (!rua || !numero || !bairro || !cidade || !uf) {
      Alert.alert('Atenção', 'Preencha todos os campos do endereço da loja.');
      return;
    }
    const enderecoCompleto = `${rua}, ${numero}, ${bairro}, ${cidade} - ${uf}`;
    try {
      await salvarEnderecoLoja(enderecoCompleto);
      Alert.alert(
        'Sucesso',
        'Os dados e o endereço da loja foram atualizados!'
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados da loja.');
    }
  }

  async function handleSalvarPromocao() {
    if (!produto || !precoOriginal || !precoPromocional || !validade) {
      Alert.alert('Atenção', 'Preencha Produto, Preços e Validade.');
      return;
    }

    const dadosPromo = {
      produto,
      categoria,
      precoOriginal: parseFloat(String(precoOriginal).replace(',', '.')),
      precoPromocional: parseFloat(String(precoPromocional).replace(',', '.')),
      unidade,
      validade,
      descricao,
      imagem:
        imagemUri ||
        'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=900&auto=format&fit=crop',
      lojaNome: usuario.nomeLoja,
      endereco: usuario.endereco || 'Endereço da loja não cadastrado',
    };

    try {
      if (modoEdicao) {
        await editarPromocao(idPromocaoEdicao, dadosPromo);
        Alert.alert('Sucesso', 'Promoção updated com sucesso!');
      } else {
        await adicionarPromocao(dadosPromo);
        Alert.alert('Sucesso', 'Promoção cadastrada com sucesso!');
      }
      limparFormulario();
      setAbaAtual('promocoes');
    } catch (error) {
      Alert.alert('Erro no Banco', 'Não foi possível salvar: ' + error.message);
    }
  }

  //FUNÇÕES DE RENDERIZAÇÃO DAS ABAS
  const renderAbaEditar = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Nome da loja</Text>
      <TextInput
        style={styles.input}
        value={nomeLoja}
        onChangeText={setNomeLoja}
      />

      <Text style={styles.label}>CNPJ/MEI</Text>
      <TextInput
        style={styles.input}
        value={cnpj}
        onChangeText={setCnpj}
        placeholder="00.000.000/0001-00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Tipo de comércio</Text>
      <TextInput
        style={styles.input}
        value={tipoComercio}
        onChangeText={setTipoComercio}
        placeholder="Ex: Hortifruti, Padaria, Açougue"
      />

      <Text style={styles.label}>CEP</Text>
      <TextInput
        style={styles.input}
        value={cep}
        onChangeText={setCep}
        placeholder="11310-000"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Endereço</Text>
      <TextInput
        style={styles.input}
        value={rua}
        onChangeText={setRua}
        placeholder="Nome da rua, avenida..."
      />

      <Text style={styles.label}>Número</Text>
      <TextInput
        style={styles.input}
        value={numero}
        onChangeText={setNumero}
        placeholder="Ex: 150"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Bairro</Text>
      <TextInput
        style={styles.input}
        value={bairro}
        onChangeText={setBairro}
        placeholder="Ex: Centro"
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            value={cidade}
            onChangeText={setCidade}
            placeholder="Ex: São Vicente"
          />
        </View>
        <View style={{ width: 80 }}>
          <Text style={styles.label}>UF</Text>
          <TextInput
            style={styles.input}
            value={uf}
            onChangeText={setUf}
            placeholder="SP"
            maxLength={2}
            autoCapitalize="characters"
          />
        </View>
      </View>

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        placeholder="(13) 90000-0000"
        keyboardType="phone-pad"
      />

      <Pressable style={styles.primaryButton} onPress={handleSalvarLoja}>
        <Text style={styles.primaryButtonText}>Salvar Loja</Text>
      </Pressable>
    </ScrollView>
  );

  const renderAbaPromocoes = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled">
      {minhasPromocoes.map((promo) => (
        <View key={promo.id} style={styles.manageCard}>
          <Image
            source={{ uri: promo.imagem }}
            style={styles.manageThumbnail}
          />

          <View style={styles.manageInfo}>
            <Text style={styles.manageTitle}>{promo.produto}</Text>
            <Text style={styles.manageSubtitle}>
              R$ {promo.precoPromocional.toFixed(2).replace('.', ',')} •
              validade {promo.validade}
            </Text>
            <Text
              style={[
                styles.manageStatus,
                promo.ativa ? styles.statusAtivo : styles.statusInativo,
              ]}>
              {promo.ativa ? 'Ativa' : 'Desativada'}
            </Text>
          </View>

          <View style={styles.manageActions}>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: '#e0f2fe' }]}
              onPress={() => iniciarEdicao(promo)}>
              <Ionicons name="create-outline" size={20} color="#0369a1" />
            </Pressable>

            <Pressable
              style={[styles.actionBtn, { backgroundColor: '#e6f3f1' }]}
              onPress={() => alternarStatusPromocao(promo.id)}>
              <Ionicons
                name={promo.ativa ? 'pause' : 'play'}
                size={20}
                color="#197278"
              />
            </Pressable>

            <Pressable
              style={[styles.actionBtn, { backgroundColor: '#fee4e2' }]}
              onPress={() => removerPromocao(promo.id)}>
              <Ionicons name="trash-outline" size={20} color="#b42318" />
            </Pressable>
          </View>
        </View>
      ))}
      {minhasPromocoes.length === 0 && (
        <Text style={styles.emptyText}>Nenhuma promoção ativa cadastrada.</Text>
      )}
    </ScrollView>
  );

  const renderAbaNova = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Produto</Text>
      <TextInput
        style={styles.input}
        value={produto}
        onChangeText={setProduto}
        placeholder="Ex: Cenoura"
      />

      <Text style={styles.label}>Categoria</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriaScroll}>
        {CATEGORIAS.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.catChip, categoria === cat && styles.catChipActive]}
            onPress={() => setCategoria(cat)}>
            <Text
              style={[
                styles.catChipText,
                categoria === cat && styles.catChipTextActive,
              ]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Preço Original</Text>
          <TextInput
            style={styles.input}
            value={precoOriginal}
            onChangeText={setPrecoOriginal}
            keyboardType="numeric"
            placeholder="10,00"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Preço Promo</Text>
          <TextInput
            style={styles.input}
            value={precoPromocional}
            onChangeText={setPrecoPromocional}
            keyboardType="numeric"
            placeholder="7,99"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Unidade</Text>
          <View style={styles.row}>
            {UNIDADES.map((u) => (
              <Pressable
                key={u}
                style={[
                  styles.catChip,
                  { paddingHorizontal: 12, marginRight: 4 },
                  unidade === u && styles.catChipActive,
                ]}
                onPress={() => setUnidade(u)}>
                <Text
                  style={[
                    styles.catChipText,
                    unidade === u && styles.catChipTextActive,
                  ]}>
                  {u}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Validade</Text>
          <Pressable
            style={[styles.input, { justifyContent: 'center' }]}
            onPress={() => setMostrarCalendario(true)}>
            <Text
              style={{ color: validade ? '#0f172a' : '#94a3b8', fontSize: 16 }}>
              {validade || 'DD/MM/AAAA'}
            </Text>
          </Pressable>

          {mostrarCalendario && (
            <DateTimePicker
              value={dataExibicao}
              mode="date"
              display="default"
              onChange={onChangeData}
            />
          )}
        </View>
      </View>

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[
          styles.input,
          { height: 80, textAlignVertical: 'top', paddingTop: 12 },
        ]}
        value={descricao}
        onChangeText={setDescricao}
        multiline
        placeholder="Detalhes sobre o produto..."
      />

      <Text style={styles.label}>Imagem do Produto</Text>
      {imagemUri && (
        <Image source={{ uri: imagemUri }} style={styles.previewImage} />
      )}
      <Pressable style={styles.ghostButton} onPress={escolherImagem}>
        <Ionicons name="image-outline" size={18} color="#197278" />
        <Text style={styles.ghostButtonText}>Escolher Imagem</Text>
      </Pressable>

      <Pressable style={styles.primaryButton} onPress={handleSalvarPromocao}>
        <Text style={styles.primaryButtonText}>
          {modoEdicao ? 'Salvar Alterações' : 'Publicar Promoção'}
        </Text>
      </Pressable>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 28 }} />
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Minha Loja</Text>
          <Text style={styles.headerSubtitle}>Área do lojista</Text>
        </View>
        <Pressable onPress={logout}>
          <Ionicons name="log-out-outline" size={28} color="#0f172a" />
        </Pressable>
      </View>

      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, abaAtual === 'editar' && styles.tabActive]}
          onPress={() => setAbaAtual('editar')}>
          <Text
            style={[
              styles.tabText,
              abaAtual === 'editar' && styles.tabTextActive,
            ]}>
            Editar Loja
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, abaAtual === 'promocoes' && styles.tabActive]}
          onPress={() => setAbaAtual('promocoes')}>
          <Text
            style={[
              styles.tabText,
              abaAtual === 'promocoes' && styles.tabTextActive,
            ]}>
            Promoções
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, abaAtual === 'nova' && styles.tabActive]}
          onPress={() => {
            if (!modoEdicao) limparFormulario();
            setAbaAtual('nova');
          }}>
          <Text
            style={[
              styles.tabText,
              abaAtual === 'nova' && styles.tabTextActive,
            ]}>
            {modoEdicao ? 'Editar' : 'Nova'}
          </Text>
        </Pressable>
      </View>

      {abaAtual === 'editar' && renderAbaEditar()}
      {abaAtual === 'promocoes' && renderAbaPromocoes()}
      {abaAtual === 'nova' && renderAbaNova()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 54,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitles: { alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  headerSubtitle: { fontSize: 13, color: '#64748b' },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginTop: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f1f5f9',
  },
  tabActive: { backgroundColor: '#197278' },
  tabText: { fontWeight: 'bold', color: '#475569', fontSize: 14 },
  tabTextActive: { color: '#ffffff' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  row: { flexDirection: 'row' },
  ghostButton: {
    flexDirection: 'row',
    height: 48,
    borderWidth: 1,
    borderColor: '#197278',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    backgroundColor: '#ffffff',
  },
  ghostButtonText: { color: '#197278', fontWeight: 'bold', marginLeft: 8 },
  primaryButton: {
    height: 50,
    backgroundColor: '#197278',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  manageCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  manageThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#e2e8f0',
  },
  manageInfo: { flex: 1 },
  manageTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  manageSubtitle: { fontSize: 14, color: '#475569', marginVertical: 4 },
  manageStatus: { fontSize: 13, fontWeight: 'bold' },
  statusAtivo: { color: '#067647' },
  statusInativo: { color: '#b42318' },
  manageActions: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { textAlign: 'center', color: '#64748b', marginTop: 30 },
  categoriaScroll: { flexDirection: 'row', marginBottom: 4 },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  catChipActive: { backgroundColor: '#197278', borderColor: '#197278' },
  catChipText: { fontWeight: 'bold', color: '#334155' },
  catChipTextActive: { color: '#ffffff' },
  previewImage: { width: '100%', height: 150, borderRadius: 8, marginTop: 8 },
});

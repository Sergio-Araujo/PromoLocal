import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePromo } from '../context/PromoContext';
import PromoCard from '../components/PromoCard';

const CATEGORIAS = [
  'Todas',
  'Frutas',
  'Legumes',
  'Bebidas',
  'Carnes',
  'Padaria',
  'Limpeza',
];

export default function ClienteScreen() {
  const { promocoes, logout } = usePromo();
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');

  // Estado para controlar se o menu lateral está aberto ou fechado
  const [menuLateralVisivel, setMenuLateralVisivel] = useState(false);

  // Filtro de promoções com base na busca e na categoria
  const promocoesFiltradas = promocoes.filter((promo) => {
    if (!promo.ativa) return false;

    const matchCategoria =
      categoriaSelecionada === 'Todas' ||
      promo.categoria === categoriaSelecionada;

    const termoBusca = busca.toLowerCase();
    const matchBusca =
      promo.produto.toLowerCase().includes(termoBusca) ||
      promo.lojaNome.toLowerCase().includes(termoBusca);

    return matchCategoria && matchBusca;
  });

  function selecionarCategoria(cat) {
    setCategoriaSelecionada(cat);
    setMenuLateralVisivel(false);
  }

  return (
    <View style={styles.container}>
      {/* MENU LATERAL */}
      <Modal
        visible={menuLateralVisivel}
        transparent={true}
        animationType="fade">
        <View style={styles.modalOverlay}>
          {/* O menu branco na esquerda */}
          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Categorias</Text>
              <Pressable onPress={() => setMenuLateralVisivel(false)}>
                <Ionicons name="close" size={28} color="#0f172a" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {CATEGORIAS.map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.drawerItem,
                    categoriaSelecionada === cat && styles.drawerItemActive,
                  ]}
                  onPress={() => selecionarCategoria(cat)}>
                  <Ionicons
                    name={
                      categoriaSelecionada === cat
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                    }
                    size={22}
                    color={categoriaSelecionada === cat ? '#197278' : '#94a3b8'}
                  />
                  <Text
                    style={[
                      styles.drawerItemText,
                      categoriaSelecionada === cat &&
                        styles.drawerItemTextActive,
                    ]}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Área escura clicável para fechar o menu clicando fora */}
          <Pressable
            style={styles.modalCloseArea}
            onPress={() => setMenuLateralVisivel(false)}
          />
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        {/* Abrir Menu Lateral */}
        <Pressable
          onPress={() => setMenuLateralVisivel(true)}
          style={{ padding: 4 }}>
          <Ionicons name="menu" size={32} color="#0f172a" />
        </Pressable>

        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>PromoLocal</Text>
          <Text style={styles.headerSubtitle}>Promoções próximas</Text>
        </View>

        <Pressable onPress={logout} style={{ padding: 4 }}>
          <Ionicons name="log-out-outline" size={28} color="#0f172a" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Barra de Busca */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produto ou loja"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        {/* Implementação de um Quick Filters na Horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}>
          {CATEGORIAS.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryButton,
                categoriaSelecionada === cat && styles.categoryActive,
              ]}
              onPress={() => setCategoriaSelecionada(cat)}>
              <Text
                style={[
                  styles.categoryText,
                  categoriaSelecionada === cat && styles.categoryTextActive,
                ]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Título da Lista */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Ofertas encontradas</Text>
          <Text style={styles.listCount}>
            {promocoesFiltradas.length}{' '}
            {promocoesFiltradas.length === 1 ? 'item' : 'itens'}
          </Text>
        </View>

        {/* Lista dos Cards */}
        {promocoesFiltradas.map((promo) => (
          <PromoCard key={promo.id} promocao={promo} />
        ))}

        {promocoesFiltradas.length === 0 && (
          <Text style={styles.emptyText}>
            Nenhuma oferta encontrada para "{categoriaSelecionada}".
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 54,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitles: { alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  headerSubtitle: { fontSize: 13, color: '#197278', fontWeight: 'bold' },
  scrollContent: { padding: 16, paddingBottom: 40 },

  // ESTILOS DO MENU LATERAL (MODAL)
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  modalCloseArea: {
    flex: 1,
  },
  drawer: {
    width: '70%',
    backgroundColor: '#ffffff',
    height: '100%',
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 54,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 16,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  drawerItemActive: {
    backgroundColor: '#f0fdfa',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginLeft: -12,
    borderBottomWidth: 0,
  },
  drawerItemText: {
    fontSize: 18,
    color: '#475569',
    marginLeft: 16,
  },
  drawerItemTextActive: {
    color: '#197278',
    fontWeight: 'bold',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#0f172a' },
  categoriesContainer: { marginBottom: 24, flexGrow: 0 },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  categoryActive: { backgroundColor: '#197278', borderColor: '#197278' },
  categoryText: { color: '#334155', fontWeight: 'bold' },
  categoryTextActive: { color: '#ffffff' },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  listCount: { fontSize: 14, color: '#64748b' },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748b',
    fontSize: 16,
  },
});

import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PromoCard({ promocao }) {
  // Função simples para abrir o mapa usando a URL universal do Google
  function abrirMapa() {
    if (!promocao.endereco) return;
    const enderecoFormatado = promocao.endereco.replace(/[\s,]+/g, '+');
    const url = `https://www.google.com/maps/search/?api=1&query=$${enderecoFormatado}`;
    Linking.openURL(url).catch(() => alert('Não foi possível abrir o mapa.'));
  }

  return (
    <View style={styles.card}>
      {/* Imagem do Produto */}
      <Image source={{ uri: promocao.imagem }} style={styles.image} />
      
      <View style={styles.body}>
        {/* Badges de Categoria e Status */}
        <View style={styles.rowBetween}>
          <Text style={styles.badgeCategoria}>{promocao.categoria}</Text>
          <Text style={[styles.badgeStatus, promocao.ativa ? styles.statusAtiva : styles.statusInativa]}>
            {promocao.ativa ? 'Ativa' : 'Inativa'}
          </Text>
        </View>

        {/* Título e Loja */}
        <Text style={styles.title}>{promocao.produto}</Text>
        <Text style={styles.storeName}>{promocao.lojaNome}</Text>

        {/* Preços */}
        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>R$ {promocao.precoOriginal.toFixed(2).replace('.', ',')}</Text>
          <Text style={styles.newPrice}>R$ {promocao.precoPromocional.toFixed(2).replace('.', ',')}/{promocao.unidade}</Text>
        </View>

        {/* Descrição e Validade */}
        <Text style={styles.description}>{promocao.descricao}</Text>
        <Text style={styles.validity}>Validade: {promocao.validade}</Text>

        {/* Box do Mapa (Fallback sem API) */}
        <Pressable style={styles.mapBox} onPress={abrirMapa}>
          <View style={styles.mapFallbackTop}>
            <Ionicons name="map-outline" size={24} color="#197278" />
            <Text style={styles.mapFallbackText}>Toque para ver a rota no Google Maps</Text>
          </View>
          <View style={styles.mapAddressBox}>
            <Ionicons name="location-outline" size={16} color="#197278" />
            <Text style={styles.mapAddressText} numberOfLines={2}>{promocao.endereco}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#e2e8f0',
  },
  body: {
    padding: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeCategoria: {
    backgroundColor: '#e6f3f1',
    color: '#197278',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusAtiva: {
    backgroundColor: '#dcfae6',
    color: '#067647',
  },
  statusInativa: {
    backgroundColor: '#fee4e2',
    color: '#b42318',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  storeName: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  oldPrice: {
    fontSize: 14,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  newPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d1495b',
  },
  description: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 8,
  },
  validity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 16,
  },
  mapBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dbe7e5',
    overflow: 'hidden',
  },
  mapFallbackTop: {
    backgroundColor: '#edf7f6',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapFallbackText: {
    color: '#197278',
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  mapAddressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
  },
  mapAddressText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  }
});
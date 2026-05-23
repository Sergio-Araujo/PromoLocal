import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  iniciarBanco, cadastrarUsuario, autenticarUsuario, listarPromocoes,
  adicionarPromocaoDB, editarPromocaoDB, alternarStatusDB, removerPromocaoDB, atualizarEnderecoDB
} from '../database/promolocalDb';

const PromoContext = createContext({});

export function PromoProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [promocoes, setPromocoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    await iniciarBanco();
    const lista = await listarPromocoes();
    
    const listaFormatada = lista.map(p => ({ ...p, ativa: p.ativa === 1 }));
    setPromocoes(listaFormatada);
    
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function cadastrar(nome, email, senha, isLojista, nomeLoja) {
    const tipo = isLojista ? 'lojista' : 'cliente';
    await cadastrarUsuario(nome, email, senha, tipo, nomeLoja);
  }

  async function login(email, senha) {
    const userDB = await autenticarUsuario(email, senha);
    if (userDB) {
      setUsuario({ 
        email: userDB.email, 
        tipo: userDB.tipo, 
        nomeLoja: userDB.nomeLoja,
        endereco: userDB.endereco 
      });
    } else {
      throw new Error('E-mail ou senha incorretos.');
    }
  }

  function logout() {
    setUsuario(null);
  }

  async function salvarEnderecoLoja(enderecoCompleto) {
    await atualizarEnderecoDB(usuario.email, enderecoCompleto);
    setUsuario(usuarioAtual => ({ ...usuarioAtual, endereco: enderecoCompleto }));
  }

  async function adicionarPromocao(novaPromocao) {
    await adicionarPromocaoDB(novaPromocao);
    await carregarDados();
  }

  async function editarPromocao(id, dadosAtualizados) {
    await editarPromocaoDB(id, dadosAtualizados);
    await carregarDados();
  }

  async function alternarStatusPromocao(id) {
    const promo = promocoes.find(p => p.id === id);
    if (promo) {
      await alternarStatusDB(id, promo.ativa);
      await carregarDados();
    }
  }

  async function removerPromocao(id) {
    await removerPromocaoDB(id);
    await carregarDados();
  }

  return (
    <PromoContext.Provider value={{
      usuario, 
      promocoes, 
      carregando,
      login, 
      cadastrar, 
      logout, 
      salvarEnderecoLoja,
      adicionarPromocao, 
      editarPromocao, 
      alternarStatusPromocao, 
      removerPromocao
    }}>
      {children}
    </PromoContext.Provider>
  );
}

export function usePromo() {
  return useContext(PromoContext);
}
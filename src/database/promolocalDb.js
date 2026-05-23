import * as SQLite from 'expo-sqlite';

let database;

async function getDatabase() {
  if (!database) {
    //A v4 foi utilizada para aplicar a nova estrutura de tabelas com colunas de endereço completas
    database = await SQLite.openDatabaseAsync('promolocal_v4.db');
  }
  return database;
}

export async function iniciarBanco() {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      tipo TEXT NOT NULL,
      nomeLoja TEXT,
      endereco TEXT
    );

    CREATE TABLE IF NOT EXISTS promocoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produto TEXT NOT NULL,
      categoria TEXT NOT NULL,
      precoOriginal REAL NOT NULL,
      precoPromocional REAL NOT NULL,
      unidade TEXT NOT NULL,
      validade TEXT NOT NULL,
      descricao TEXT,
      imagem TEXT,
      ativa INTEGER DEFAULT 1,
      lojaNome TEXT NOT NULL,
      endereco TEXT
    );
  `);

  await inserirDadosIniciais(db);
}

async function inserirDadosIniciais(db) {
  const qtdUsuarios = await db.getFirstAsync(
    'SELECT COUNT(*) as qtd FROM usuarios'
  );

  if (qtdUsuarios.qtd === 0) {
    // Cliente de teste
    await db.runAsync(
      'INSERT INTO usuarios (nome, email, senha, tipo, nomeLoja, endereco) VALUES (?, ?, ?, ?, ?, ?)',
      ['Aluno UniBR', 'aluno@unibr.com', '123456', 'cliente', '', '']
    );
    // Lojista de teste já com um endereço real estruturado para o mapa
    await db.runAsync(
      'INSERT INTO usuarios (nome, email, senha, tipo, nomeLoja, endereco) VALUES (?, ?, ?, ?, ?, ?)',
      [
        'Lojista Teste',
        'lojista@teste.com',
        '123456',
        'lojista',
        'Horti Centro',
        'Praça Barão do Rio Branco, 15, Centro, São Vicente - SP',
      ]
    );
  }

  const qtdPromocoes = await db.getFirstAsync(
    'SELECT COUNT(*) as qtd FROM promocoes'
  );

  if (qtdPromocoes.qtd === 0) {
    await db.runAsync(
      `INSERT INTO promocoes (produto, categoria, precoOriginal, precoPromocional, unidade, validade, descricao, imagem, ativa, lojaNome, endereco) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        'Cenoura',
        'Legumes',
        8.5,
        5.99,
        'kg',
        '08/06/2026',
        'Cenoura fresca para saladas, sopas e receitas do dia a dia.',
        'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=900&auto=format&fit=crop',
        'Horti Centro',
        'Praça Barão do Rio Branco, 15, Centro, São Vicente - SP',
      ]
    );

    await db.runAsync(
      `INSERT INTO promocoes (produto, categoria, precoOriginal, precoPromocional, unidade, validade, descricao, imagem, ativa, lojaNome, endereco) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        'Banana Nanica',
        'Frutas',
        7.99,
        4.99,
        'kg',
        '10/06/2026',
        'Banana madura e selecionada para a semana.',
        'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=900&auto=format&fit=crop',
        'Mercado São Vicente',
        'Rua Frei Gaspar, Centro, São Vicente, SP',
      ]
    );
  }
}

// OPERAÇÕES DE USUÁRIO
export async function cadastrarUsuario(
  nome,
  email,
  senha,
  tipo,
  nomeLoja = ''
) {
  const db = await getDatabase();
  const verifica = await db.getFirstAsync(
    'SELECT id FROM usuarios WHERE email = ?',
    [email]
  );
  if (verifica) {
    throw new Error('Este e-mail já está em uso.');
  }

  await db.runAsync(
    'INSERT INTO usuarios (nome, email, senha, tipo, nomeLoja, endereco) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, email, senha, tipo, nomeLoja, '']
  );
}

export async function autenticarUsuario(email, senha) {
  const db = await getDatabase();
  return await db.getFirstAsync(
    'SELECT id, nome, email, tipo, nomeLoja, endereco FROM usuarios WHERE email = ? AND senha = ?',
    [email, senha]
  );
}

export async function atualizarEnderecoDB(email, enderecoCompleto) {
  const db = await getDatabase();
  await db.runAsync('UPDATE usuarios SET endereco = ? WHERE email = ?', [
    enderecoCompleto,
    email,
  ]);
}

// OPERAÇÕES DE PROMOÇÃO
export async function listarPromocoes() {
  const db = await getDatabase();
  return await db.getAllAsync('SELECT * FROM promocoes ORDER BY id DESC');
}

export async function adicionarPromocaoDB(promo) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO promocoes (produto, categoria, precoOriginal, precoPromocional, unidade, validade, descricao, imagem, ativa, lojaNome, endereco)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
    [
      promo.produto,
      promo.categoria,
      promo.precoOriginal,
      promo.precoPromocional,
      promo.unidade,
      promo.validade,
      promo.descricao,
      promo.imagem,
      promo.lojaNome,
      promo.endereco,
    ]
  );
}

export async function editarPromocaoDB(id, promo) {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE promocoes SET produto=?, categoria=?, precoOriginal=?, precoPromocional=?, unidade=?, validade=?, descricao=?, imagem=? WHERE id=?`,
    [
      promo.produto,
      promo.categoria,
      promo.precoOriginal,
      promo.precoPromocional,
      promo.unidade,
      promo.validade,
      promo.descricao,
      promo.imagem,
      id,
    ]
  );
}

export async function alternarStatusDB(id, statusAtual) {
  const db = await getDatabase();
  await db.runAsync('UPDATE promocoes SET ativa = ? WHERE id = ?', [
    statusAtual ? 0 : 1,
    id,
  ]);
}

export async function removerPromocaoDB(id) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM promocoes WHERE id = ?', [id]);
}

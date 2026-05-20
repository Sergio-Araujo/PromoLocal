import * as SQLite from 'expo-sqlite';

let database;

async function getDatabase() {
  // Deixo o banco em uma variavel para nao abrir uma conexao nova toda hora.
  if (!database) {
    database = await SQLite.openDatabaseAsync('promolocal.db');
  }

  return database;
}

export async function iniciarBanco() {
  const db = await getDatabase();

  // Crio as tabelas principais do aplicativo: uma para loja e outra para promocoes.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS loja (
      id INTEGER PRIMARY KEY NOT NULL,
      nome TEXT,
      documento TEXT,
      tipo TEXT,
      cep TEXT,
      rua TEXT,
      bairro TEXT,
      cidade TEXT,
      uf TEXT,
      telefone TEXT,
      descricao TEXT
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
      lojaNome TEXT NOT NULL
    );
  `);

  await inserirDadosIniciais();
}

async function inserirDadosIniciais() {
  const db = await getDatabase();
  const loja = await db.getFirstAsync('SELECT id FROM loja WHERE id = 1');
  const total = await db.getFirstAsync('SELECT COUNT(*) as quantidade FROM promocoes');

  // Esses dados ajudam o app a abrir com conteudo, igual um prototipo funcional.
  if (!loja) {
    await db.runAsync(
      `INSERT INTO loja
      (id, nome, documento, tipo, cep, rua, bairro, cidade, uf, telefone, descricao)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Mercado Sao Vicente',
        '12.345.678/0001-90',
        'Supermercado',
        '11310-000',
        'Rua Frei Gaspar',
        'Centro',
        'Sao Vicente',
        'SP',
        '(13) 99999-0000',
        'Mercado local com ofertas de alimentos e bebidas.'
      ]
    );
  }

  if (total.quantidade === 0) {
    const exemplos = [
      ['Banana nanica', 'Frutas', 7.99, 4.99, 'kg', '2026-06-10', 'Banana madura e selecionada para a semana.', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=900&auto=format&fit=crop', 1, 'Mercado Sao Vicente'],
      ['Cenoura', 'Legumes', 8.5, 5.99, 'kg', '2026-06-08', 'Cenoura fresca para saladas, sopas e receitas do dia a dia.', 'https://agristar.com.br/upload/blog/original/conheca-os-beneficios-da-cenoura-a-aprenda-como-cultiva-la-em-casa-06-07-2023-11-49-49-8328.jpg', 1, 'Horti Centro'],
      ['Refrigerante coca cola', 'Bebidas', 8.99, 6.49, 'un', '2026-06-15', 'Garrafa de 2 litros com preco promocional.', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=900&auto=format&fit=crop', 1, 'Mini Mercado Praia'],
      ['Carne moida', 'Carnes', 34.9, 27.9, 'kg', '2026-06-06', 'Oferta valida enquanto durar o estoque.', 'https://www.receitasonline.com.br/wp-content/uploads/Carne-moida-de-forno-750x422.jpg', 0, 'Acougue Popular']
    ];

    for (const item of exemplos) {
      await db.runAsync(
        `INSERT INTO promocoes
        (produto, categoria, precoOriginal, precoPromocional, unidade, validade, descricao, imagem, ativa, lojaNome)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        item
      );
    }
  }

  // Se o banco ja existia sem foto, eu completo as imagens dos exemplos principais.
  await db.runAsync(
    'UPDATE promocoes SET imagem = ? WHERE produto = ? AND (imagem IS NULL OR imagem = ?)',
    ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=900&auto=format&fit=crop', 'Banana nanica', '']
  );
  await db.runAsync(
    'UPDATE promocoes SET imagem = ? WHERE produto = ? AND (imagem IS NULL OR imagem = ?)',
    ['https://agristar.com.br/upload/blog/original/conheca-os-beneficios-da-cenoura-a-aprenda-como-cultiva-la-em-casa-06-07-2023-11-49-49-8328.jpg', 'Cenoura', '']
  );
  await db.runAsync(
    'UPDATE promocoes SET produto = ?, precoOriginal = ?, precoPromocional = ?, descricao = ?, imagem = ? WHERE produto = ?',
    ['Cenoura', 8.5, 5.99, 'Cenoura fresca para saladas, sopas e receitas do dia a dia.', 'https://agristar.com.br/upload/blog/original/conheca-os-beneficios-da-cenoura-a-aprenda-como-cultiva-la-em-casa-06-07-2023-11-49-49-8328.jpg', 'Tomate italiano']
  );
  await db.runAsync(
    'UPDATE promocoes SET imagem = ? WHERE produto = ? AND (imagem IS NULL OR imagem = ?)',
    ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=900&auto=format&fit=crop', 'Refrigerante cola', '']
  );
  await db.runAsync(
    'UPDATE promocoes SET imagem = ? WHERE produto = ? AND (imagem IS NULL OR imagem = ?)',
    ['https://www.receitasonline.com.br/wp-content/uploads/Carne-moida-de-forno-750x422.jpg', 'Carne moida', '']
  );
  await db.runAsync(
    'UPDATE promocoes SET imagem = ? WHERE produto = ?',
    ['https://agristar.com.br/upload/blog/original/conheca-os-beneficios-da-cenoura-a-aprenda-como-cultiva-la-em-casa-06-07-2023-11-49-49-8328.jpg', 'Cenoura']
  );
  await db.runAsync(
    'UPDATE promocoes SET imagem = ? WHERE produto = ?',
    ['https://www.receitasonline.com.br/wp-content/uploads/Carne-moida-de-forno-750x422.jpg', 'Carne moida']
  );
  await db.runAsync(
    'UPDATE promocoes SET produto = ? WHERE produto = ?',
    ['Refrigerante Coca-Cola', 'Refrigerante cola']
  );

}
  
export async function listarPromocoes() {
  const db = await getDatabase();
  return db.getAllAsync('SELECT * FROM promocoes ORDER BY ativa DESC, validade ASC');
}

export async function buscarLoja() {
  const db = await getDatabase();
  return db.getFirstAsync('SELECT * FROM loja WHERE id = 1');
}

export async function salvarLoja(loja) {
  const db = await getDatabase();

  // Uso REPLACE para salvar a loja sempre no id 1, que representa o lojista logado.
  await db.runAsync(
    `REPLACE INTO loja
    (id, nome, documento, tipo, cep, rua, bairro, cidade, uf, telefone, descricao)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      loja.nome,
      loja.documento,
      loja.tipo,
      loja.cep,
      loja.rua,
      loja.bairro,
      loja.cidade,
      loja.uf,
      loja.telefone,
      loja.descricao
    ]
  );
}

export async function criarPromocao(promocao) {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO promocoes
    (produto, categoria, precoOriginal, precoPromocional, unidade, validade, descricao, imagem, ativa, lojaNome)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    [
      promocao.produto,
      promocao.categoria,
      Number(promocao.precoOriginal),
      Number(promocao.precoPromocional),
      promocao.unidade,
      promocao.validade,
      promocao.descricao,
      promocao.imagem,
      promocao.lojaNome
    ]
  );
}

export async function alternarStatusPromocao(id, ativa) {
  const db = await getDatabase();
  // Quando o lojista toca no botao, eu apenas troco entre ativo e inativo.
  await db.runAsync('UPDATE promocoes SET ativa = ? WHERE id = ?', [ativa ? 1 : 0, id]);
}

export async function excluirPromocao(id) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM promocoes WHERE id = ?', [id]);
}

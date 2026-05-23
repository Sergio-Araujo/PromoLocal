# 🛒 PromoLocal

O **PromoLocal** é um aplicativo mobile desenvolvido com React Native e Expo que tem como objetivo conectar consumidores a ofertas de comércios regionais (hortifrútis, mercados, padarias, etc.).

A plataforma oferece uma vitrine digital onde os comerciantes podem gerenciar suas promoções em tempo real e os clientes podem descobrir os melhores preços na sua região, com integração direta de rotas via Google Maps.

---

# ✨ Funcionalidades

O aplicativo possui fluxos distintos para dois tipos de usuários:

## 🏪 Para o Lojista

* **Gestão de Perfil:** Atualização de dados da loja e endereço completo.
* **Gerenciamento de Promoções (CRUD):**
  * Criação de novas ofertas com foto.
  * Edição completa de ofertas existentes.
  * Pausa rápida de promoções esgotadas.
  * Exclusão permanente de promoções.

## 🛍️ Para o Cliente

* **Feed de Ofertas:** Visualização em tempo real das promoções.
* **Busca e Filtros:** Pesquisa textual e filtros por categorias.
* **Integração com Mapas:** Redirecionamento direto para o Google Maps.

---

# 🚀 Tecnologias Utilizadas

* **[React Native](https://reactnative.dev/)**
* **[Expo](https://expo.dev/)**
* **[Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)**
* **Context API**
* **Expo Image Picker**
* **React Native DateTimePicker**
* **Linking API**

---

# 📂 Estrutura do Projeto

```text
├── assets/                 # Imagens, ícones e recursos visuais do app
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── context/            # Gerenciamento de estado global
│   ├── database/           # Configurações SQLite
│   └── screens/            # Telas da aplicação
├── App.js                  # Ponto de entrada
├── package.json            # Dependências do projeto
└── README.md               # Documentação
```

---

# 🛠️ Como rodar o projeto

## Pré-requisitos

Certifique-se de ter instalado:

* **[Node.js](https://nodejs.org/)**
* **[Expo Go](https://expo.dev/client)**

---

## Passo a passo

### 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/promolocal.git
cd promolocal
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o projeto

```bash
npx expo start
```

### 4. Execute no dispositivo

* **Android:** escaneie o QR Code com o Expo Go.
* **iOS:** utilize a câmera do iPhone.
* **Emulador:** pressione `a` para Android ou `i` para iOS.

---

# 💡 Nota sobre o Banco de Dados (SQLite)

Na primeira execução do aplicativo:

* O banco SQLite será criado automaticamente.
* As tabelas `usuarios` e `promocoes` serão geradas.
* Dados iniciais serão inseridos automaticamente.

### Contas de teste

```text
Cliente:
email: aluno@unibr.com
senha: 123456

Lojista:
email: lojista@teste.com
senha: 123456
```

---

# 📝 Licença

Este projeto foi desenvolvido como trabalho acadêmico de extensão para a disciplina de Desenvolvimento Mobile.

Sinta-se à vontade para estudar, melhorar e utilizar como referência.

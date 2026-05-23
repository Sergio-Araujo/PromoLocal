# 🛒 PromoLocal

O **PromoLocal** é um aplicativo mobile desenvolvido com React Native e Expo que tem como objetivo conectar consumidores a ofertas de comércios regionais (hortifrútis, mercados, padarias, etc.). 

A plataforma oferece uma vitrine digital onde os comerciantes podem gerenciar suas promoções em tempo real e os clientes podem descobrir os melhores preços na sua região, com integração direta de rotas via Google Maps.

---

## ✨ Funcionalidades

O aplicativo possui fluxos distintos para dois tipos de usuários:

### 🏪 Para o Lojista
* **Gestão de Perfil:** Atualização de dados da loja e endereço completo.
* **Gerenciamento de Promoções (CRUD):**
  * Edição de ofertas existentes.
  * Pausa (inativação) rápida de promoções esgotadas.
  * Exclusão de promoções.

### 🛍️ Para o Cliente
* **Feed de Ofertas:** Visualização de todas as promoções ativas na região.
* **Busca e Filtros:** Pesquisa por nome do produto/loja e filtros por categorias (Frutas, Carnes, Limpeza, etc.) via Chips e Menu Lateral.
* **Integração com Mapas:** Botão que abre o trajeto exato até a loja utilizando o Google Maps.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

* **[React Native](https://reactnative.dev/)** & **[Expo](https://expo.dev/)**: Desenvolvimento multiplataforma (Android/iOS).
* **[Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)**: Banco de dados relacional para persistência de dados local (Offline-first).
* **Context API**: Gerenciamento de estados globais da aplicação.
* **Expo Image Picker**: Acesso à galeria para upload de fotos dos produtos.
* **React Native DateTimePicker**: Componente nativo para seleção de datas de validade.
* **Linking API**: Integração com rotas do Google Maps.

---

## 📂 Estrutura do Projeto

```text
├── assets/                 # Imagens e ícones do app
├── src/
│   ├── components/         # Componentes reutilizáveis (ex: PromoCard)
│   ├── context/            # Context API (PromoContext)
│   ├── database/           # Configuração e Queries do SQLite (promolocalDb.js)
│   └── screens/            # Telas da aplicação (Login, Cliente, Lojista)
├── App.js                  # Ponto de entrada e navegação principal
├── package.json            # Dependências do projeto
└── README.md

🛠️ Como rodar o projeto
Pré-requisitos
Certifique-se de ter o Node.js e o aplicativo Expo Go instalados no seu celular (ou um emulador configurado).

Passo a passo
1. Clone o repositório
git clone [https://github.com/SEU-USUARIO/promolocal.git](https://github.com/SEU-USUARIO/promolocal.git)
cd promolocal

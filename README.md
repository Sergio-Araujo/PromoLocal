# 🛒 PromoLocal

O **PromoLocal** é um aplicativo mobile desenvolvido com React Native e Expo que tem como objetivo conectar consumidores a ofertas de comércios regionais (hortifrútis, mercados, padarias, etc.). 

A plataforma oferece uma vitrine digital onde os comerciantes podem gerenciar suas promoções em tempo real e os clientes podem descobrir os melhores preços na sua região, com integração direta de rotas via Google Maps.

---

## ✨ Funcionalidades

O aplicativo possui fluxos primitivos e distintos para dois tipos de usuários:

### 🏪 Para o Lojista
* **Gestão de Perfil:** Atualização de dados da loja e endereço completo (Rua, Número, Bairro, Cidade e UF).
* **Gerenciamento de Promoções (CRUD):** * Criação de novas ofertas com foto (Galeria via Expo Image Picker), preço original, preço promocional, validade e unidade (kg, L, un).
  * Edição completa de ofertas existentes.
  * Pausa (inativação) rápida de promoções esgotadas sem a necessidade de exclusão.
  * Exclusão permanente de promoções.

### 🛍️ Para o Cliente
* **Feed de Ofertas:** Visualização em tempo real de todas as promoções ativas na região.
* **Busca e Filtros:** Pesquisa textual por nome do produto ou da loja e filtros por categorias (Frutas, Legumes, Bebidas, Carnes, Padaria, Limpeza) sincronizados entre os chips horizontais e o Menu Lateral (Drawer).
* **Integração com Mapas:** Botão de rota no card da promoção que redireciona o usuário diretamente para o aplicativo do Google Maps com o trajeto físico traçado.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias e componentes:

* **[React Native](https://reactnative.dev/)** & **[Expo](https://expo.dev/)**: Framework para desenvolvimento mobile nativo multiplataforma.
* **[Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)**: Banco de dados relacional para persistência de dados local no dispositivo (estratégia offline-first).
* **Context API**: Gerenciamento de estados globais e sincronização de dados entre telas.
* **Expo Image Picker**: Componente para acessar a galeria de mídia e carregar fotos nos produtos.
* **React Native DateTimePicker**: Seletor nativo de calendário para a definição das datas de validade.
* **Linking API**: Módulo nativo para comunicação e abertura de rotas no aplicativo externo do Google Maps.

---

## 📂 Estrutura do Projeto

├── assets/                 # Imagens, ícones e recursos visuais do app
├── src/
│   ├── components/         # Componentes reutilizáveis de interface (ex: PromoCard)
│   ├── context/            # Gerenciamento de estado global (PromoContext.js)
│   ├── database/           # Configurações, tabelas e queries do SQLite (promolocalDb.js)
│   └── screens/            # Telas da aplicação (LoginScreen, ClienteScreen, LojistaScreen)
├── App.js                  # Ponto de entrada do app e chaveamento de rotas/telas
├── package.json            # Dependências e scripts de execução do projeto
└── README.md               # Documentação do repositório

---

## 🛠️ Como rodar o projeto

### Pré-requisitos
Certifique-se de ter o **[Node.js](https://nodejs.org/)** instalado em sua máquina de desenvolvimento e o aplicativo **[Expo Go](https://expo.dev/client)** instalado no seu celular físico (disponível na Google Play Store ou App Store) ou, alternativamente, um emulador mobile configurado (Android Studio / Xcode Simulator).

### Passo a passo

1. **Clone o repositório para sua máquina local**
   ```bash
   git clone [https://github.com/SEU-USUARIO/promolocal.git](https://github.com/SEU-USUARIO/promolocal.git)
   cd promolocal

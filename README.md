# TEA: The Exomoon Archive

**TEA (The Exomoon Archive)** is a web application built to explore and visualize astronomical data. The project's goal is to create a comprehensive dataset of exoplanets discussed in exomoon research, serving as a centralized resource for the scientific community to advance the search for moons beyond our solar system.

<p align="center">
  <img src="public/logo.png" width="300" alt="Project Logo">
</p>

## ✨ Features

-   **Interactive Data Tables:** View and sort data with a flexible and powerful table component.
-   **Multiple Datasets:** Explore various datasets, including:
    -   Cumulative Kepler Objects of Interest (KOI)
    -   Confirmed Planetary Systems
    -   A curated list of scientific papers
-   **Data Export:** Export table data to an Excel file.
-   **Responsive Design:** The application is designed to work on different screen sizes.
-   **Engaging Backgrounds:** Features a dynamic particle background for a more immersive experience.

## 🚀 Technologies Used

-   **Frontend:** [React](https://reactjs.org/), [Vite](https://vitejs.dev/)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **Tables:** [TanStack Table](https://tanstack.com/table/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/guide/react) for icons
-   **Data Parsing:** [PapaParse](https://www.papaparse.com/) for CSV files
-   **Excel Export:** [XLSX](https://github.com/SheetJS/sheetjs) (SheetJS)


---

# TEA: The Exomoon Archive (Português)

**TEA (The Exomoon Archive)** é uma aplicação web construída para explorar e visualizar dados astronômicos. O objetivo do projeto é criar um conjunto de dados abrangente de exoplanetas discutidos em pesquisas sobre exoluas, servindo como um recurso centralizado para a comunidade científica avançar na busca por luas além do nosso sistema solar.

<p align="center">
  <img src="public/logo.png" width="300" alt="Project Logo">
</p>

## ✨ Funcionalidades

-   **Tabelas de Dados Interativas:** Visualize e ordene dados com um componente de tabela flexível e poderoso.
-   **Múltiplos Conjuntos de Dados:** Explore diversos conjuntos de dados, incluindo:
    -   Objetos de Interesse Kepler (KOI) Cumulativos
    -   Sistemas Planetários Confirmados
    -   Uma lista curada de artigos científicos
-   **Exportação de Dados:** Exporte os dados da tabela para um arquivo Excel.
-   **Design Responsivo:** A aplicação é projetada para funcionar em diferentes tamanhos de tela.
-   **Planos de Fundo Atraentes:** Apresenta um fundo de partículas dinâmico para uma experiência mais imersiva.

## 🚀 Tecnologias Utilizadas

-   **Frontend:** [React](https://reactjs.org/), [Vite](https://vitejs.dev/)
-   **Roteamento:** [React Router](https://reactrouter.com/)
-   **Tabelas:** [TanStack Table](https://tanstack.com/table/)
-   **Estilização:** [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/guide/react) para ícones
-   **Análise de Dados:** [PapaParse](https://www.papaparse.com/) para arquivos CSV
-   **Exportação para Excel:** [XLSX](https://github.com/SheetJS/sheetjs) (SheetJS)

## ⚙️ Como Começar

Siga estas instruções para obter uma cópia do projeto em funcionamento na sua máquina local.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
-   [npm](https://www.npmjs.com/) (incluído no Node.js)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repo-nome.git
    cd seu-repo-nome
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173`.

## 📁 Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
/
├── public/                  # Ativos estáticos e arquivos de dados CSV
├── src/
│   ├── assets/              # Ativos estáticos do React e outros
│   ├── blocks/              # Componentes maiores e independentes (ex: planos de fundo)
│   ├── Components/          # Componentes de UI reutilizáveis (Navbar, Tabela, etc.)
│   ├── lib/                 # Hooks e funções utilitárias
│   ├── Pages/               # Páginas principais para diferentes visualizações de dados
│   ├── utils/               # Utilitários de ajuda (ex: exportação para Excel)
│   ├── App.jsx              # Componente principal da aplicação
│   ├── main.jsx             # Ponto de entrada da aplicação
│   └── index.css            # Estilos globais
├── .gitignore
├── package.json
└── vite.config.js
```
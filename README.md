<<<<<<< HEAD
# NEFRA_Connections 🚀
=======
<<<<<<< HEAD
# NEFRA_Connections
>>>>>>> 33bd874 (Add files via upload)

NEFRA_Connections is a professional networking platform designed to connect **Entrepreneurs** and **Investors**. This project demonstrates a full-stack architecture using **React** for the frontend and **Spring Boot** for the backend.

---

## 🛠 Tech Stack

### **Frontend**
* **Framework**: React 18 with TypeScript
* **Styling**: Tailwind CSS v4
* **Animations**: Framer Motion
* **Build Tool**: Vite

### **Backend**
* **Framework**: Spring Boot 3.x
* **Language**: Java 17/21
* **Build Tool**: Maven
* **Libraries**: Lombok (for boilerplate reduction)

---

## 🚀 Getting Started

### **1. Backend (Spring Boot)**
* Open the backend folder in **IntelliJ IDEA**.
* Ensure Maven dependencies are loaded.
* Run `NefraConnectionsApplication.java`.
* The server will start on: `http://localhost:8080`

<<<<<<< HEAD
### **2. Frontend (React)**
* Open the frontend folder in **VS Code**.
* Install dependencies:
  ```bash
  npm install
=======
---

## Getting Started

1. **Clone the repository:**
   `git clone https://github.com/MUKUNTHANMS007/NEFRA_Connections.git`

2. **Install dependencies:**
   `npm install`

3. **Launch the development server:**
   `npm run dev`

---

## Project Structure

* **src/app**: Routing and Core Logic
* **src/components**: Layout and Reusable UI components
* **src/pages**: Main View Components (Home, Search, Profile, Company)
* **src/services**: API and Mock Data handling
* **src/types**: TypeScript Definitions
* **src/assets**: Branding and Media assets

---

## Author

**Mukunthan**
Pre-final year Engineering Student at PSG iTech
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
>>>>>>> d84d772 (Add files via upload)
>>>>>>> 33bd874 (Add files via upload)

# Frontend Setup Guide

Guía paso a paso para inicializar el frontend del proyecto.

## 🎯 Decisión de Stack

Antes de comenzar, decide qué stack usar:

### Opción 1: React + Vite ⭐ (Recomendado)
**Ventajas:**
- Muy rápido (HMR instantáneo)
- Configuración simple
- Bundle pequeño
- Perfecto para SPAs

**Cuándo usar:**
- Aplicación de página única (SPA)
- No necesitas SEO
- Quieres máxima velocidad de desarrollo

### Opción 2: Next.js 14
**Ventajas:**
- SSR out-of-the-box
- Excelente SEO
- API Routes integradas
- Optimización de imágenes

**Cuándo usar:**
- Necesitas SEO
- Quieres SSR/SSG
- Aplicación más compleja

### Opción 3: Vue 3 + Vite
**Ventajas:**
- Sintaxis más simple
- Composition API potente
- Performance excelente

**Cuándo usar:**
- Prefieres Vue sobre React
- Equipo con experiencia en Vue

---

## 📦 Setup: React + Vite (Recomendado)

### 1. Crear proyecto

```bash
cd D:\Dev\Seguidores
npm create vite@latest frontend -- --template react-ts
cd frontend
```

### 2. Instalar dependencias base

```bash
npm install
```

### 3. Instalar dependencias adicionales

```bash
# Routing
npm install react-router-dom

# State Management
npm install zustand

# HTTP Client
npm install axios

# Forms
npm install react-hook-form zod @hookform/resolvers

# UI Components (elige uno)
npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-select
# O
npm install @mui/material @emotion/react @emotion/styled
# O
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Charts
npm install recharts

# Tables
npm install @tanstack/react-table

# Date handling
npm install date-fns

# Icons
npm install lucide-react
# O
npm install react-icons
```

### 4. Configurar TailwindCSS

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Configurar Vite para proxy

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```

### 6. Configurar path aliases en tsconfig

```json
// tsconfig.json
{
  "compilerOptions": {
    // ... otras opciones
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 7. Crear archivo .env

```bash
# .env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Instagram Follower Tracker
```

### 8. Estructura inicial

```bash
# Crear estructura de carpetas (ya existe)
# Las carpetas ya están creadas en src/
```

### 9. Iniciar desarrollo

```bash
npm run dev
```

El frontend estará en `http://localhost:5173`

---

## 📦 Setup: Next.js 14 (Alternativo)

### 1. Crear proyecto

```bash
cd D:\Dev\Seguidores
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir --import-alias "@/*"
cd frontend
```

### 2. Instalar dependencias adicionales

```bash
npm install axios zustand
npm install react-hook-form zod @hookform/resolvers
npm install recharts
npm install @tanstack/react-table
npm install date-fns
npm install lucide-react
```

### 3. Configurar variables de entorno

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Iniciar desarrollo

```bash
npm run dev
```

---

## 🚀 Primeros Pasos

### 1. Crear componente de prueba

```tsx
// src/App.tsx
import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600">
          Instagram Follower Tracker
        </h1>
        <p className="mt-4 text-gray-600">
          Frontend en desarrollo...
        </p>
      </div>
    </div>
  )
}

export default App
```

### 2. Crear primer servicio API

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

### 3. Probar conexión con backend

```typescript
// src/services/test.service.ts
import api from './api';

export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('Backend connected:', response.data);
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};
```

---

## 📝 Scripts Útiles

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  }
}
```

---

## ✅ Checklist de Setup

- [ ] Proyecto inicializado (Vite/Next.js)
- [ ] Dependencias instaladas
- [ ] TailwindCSS configurado
- [ ] Path aliases configurados (@/*)
- [ ] Proxy a backend configurado
- [ ] Variables de entorno creadas
- [ ] Estructura de carpetas verificada
- [ ] Componente de prueba funcionando
- [ ] Conexión con backend testeada

---

## 🎨 Recursos Útiles

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## 🐛 Troubleshooting

### Error: Cannot find module '@/*'
Asegúrate de tener configurado path aliases en vite.config.ts y tsconfig.json

### Error: CORS
Configura el proxy en vite.config.ts o habilita CORS en el backend

### Error: API connection failed
Verifica que el backend esté corriendo en `http://localhost:3000`

---

## 📞 Siguiente Paso

Una vez completado el setup, consulta `todo.md` para ver los EPICs de desarrollo frontend.
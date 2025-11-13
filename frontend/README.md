# Frontend - Instagram Follower Tracker

Frontend web application para el sistema de seguimiento de seguidores de Instagram.

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── common/       # Componentes comunes (Button, Input, etc.)
│   │   ├── layout/       # Componentes de layout (Header, Sidebar, Footer)
│   │   └── features/     # Componentes específicos por feature
│   ├── pages/            # Páginas de la aplicación
│   │   ├── Dashboard/
│   │   ├── Upload/
│   │   ├── Whitelist/
│   │   ├── NonFollowers/
│   │   └── ExFollowers/
│   ├── services/         # Servicios para llamadas API
│   │   ├── api.ts
│   │   ├── whitelist.service.ts
│   │   ├── nonFollowers.service.ts
│   │   └── exFollowers.service.ts
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useLocalStorage.ts
│   ├── utils/            # Utilidades y helpers
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── types/            # TypeScript types e interfaces
│   │   ├── user.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   ├── assets/           # Archivos estáticos (imágenes, iconos)
│   └── styles/           # Estilos globales
│       ├── globals.css
│       └── variables.css
├── public/               # Archivos públicos
├── .env.example          # Variables de entorno ejemplo
└── README.md            # Este archivo
```

## 🚀 Stack Tecnológico Propuesto

### Opción 1: React + Vite (Recomendado para este proyecto)
- **Framework**: React 18
- **Build Tool**: Vite
- **Lenguaje**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand / Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod
- **UI Components**: shadcn/ui / Radix UI
- **Charts**: Recharts / Chart.js
- **Tables**: TanStack Table

### Opción 2: Next.js 14 (Si necesitas SSR/SEO)
- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **API Routes**: Next.js API Routes
- **UI Components**: shadcn/ui
- **Charts**: Recharts

### Opción 3: Vue 3 (Alternativa)
- **Framework**: Vue 3 + Vite
- **Lenguaje**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Components**: Vuetify / Element Plus

## 📦 Instalación (Pendiente)

```bash
# Opción 1: React + Vite
npm create vite@latest frontend -- --template react-ts

# Opción 2: Next.js
npx create-next-app@latest frontend --typescript --tailwind --app

# Opción 3: Vue
npm create vite@latest frontend -- --template vue-ts
```

## 🛠️ Configuración

### Variables de Entorno

Crear archivo `.env` en `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Instagram Follower Tracker
```

### Instalar Dependencias

```bash
cd frontend
npm install

# Dependencias adicionales recomendadas
npm install axios react-router-dom zustand
npm install -D tailwindcss postcss autoprefixer
npm install react-hook-form zod @hookform/resolvers
npm install recharts
npm install @tanstack/react-table
```

## 📝 Scripts Disponibles (Una vez configurado)

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Ejecutar linter
npm run test         # Ejecutar tests
```

## 🎯 Páginas a Implementar

1. **Dashboard** (`/`)
   - Resumen de estadísticas
   - Gráficos de evolución
   - Accesos rápidos

2. **Upload JSON** (`/upload`)
   - Drag & drop para archivo
   - Preview de datos
   - Validación de formato

3. **Whitelist** (`/whitelist`)
   - Lista de usuarios en whitelist
   - Agregar/eliminar usuarios
   - Búsqueda y filtros

4. **Non-Followers** (`/non-followers`)
   - Lista de usuarios que no siguen
   - Acciones bulk
   - Mover a ex-followers

5. **Ex-Followers** (`/ex-followers`)
   - Historial de unfollows
   - Filtros por fecha
   - Estadísticas

## 🔌 Integración con Backend

### Configurar Proxy (Vite)

En `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```

### Estructura de Servicios

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

## 🎨 Componentes a Crear

### Componentes Comunes
- `Button.tsx` - Botón reutilizable
- `Input.tsx` - Input con validación
- `Table.tsx` - Tabla con paginación
- `Modal.tsx` - Modal genérico
- `Card.tsx` - Card container
- `Loading.tsx` - Spinner/Skeleton
- `Toast.tsx` - Notificaciones

### Componentes de Layout
- `Header.tsx` - Header con navegación
- `Sidebar.tsx` - Menú lateral
- `Layout.tsx` - Layout principal
- `Footer.tsx` - Footer

### Componentes Específicos
- `UserTable.tsx` - Tabla de usuarios
- `StatCard.tsx` - Card de estadística
- `FileUpload.tsx` - Upload de archivos
- `Chart.tsx` - Gráficos

## 🚧 Estado del Proyecto

**PENDIENTE DE INICIALIZACIÓN**

Ver `../todo.md` para el roadmap completo de desarrollo frontend.

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🔗 Enlaces

- Backend API: `http://localhost:3000/api`
- Frontend Dev: `http://localhost:5173` (Vite default)
- Base de datos: MySQL `127.0.0.1:3306`
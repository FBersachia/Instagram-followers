# Instagram Follower Tracker

Sistema para rastrear y gestionar seguidores de Instagram que no te siguen de vuelta.

## ✓ Estado del Proyecto

**MVP BACKEND COMPLETADO** ✓ - El sistema backend CLI está completamente funcional y listo para usar.

**FRONTEND EN DESARROLLO** 🚧 - Estructura creada, pendiente de inicialización (ver `frontend/SETUP_GUIDE.md`)

## Requisitos

- Node.js (v16 o superior) ✓
- Docker Desktop (for local development) ✓
- PostgreSQL Database ✓
  - **Local Development**: Docker PostgreSQL container
  - **Production**: Supabase Cloud-hosted PostgreSQL
- npm ✓

## Instalación

### Quick Start (Local Development)

1. **Instalar dependencias:**
   ```bash
   npm install
   cd frontend && npm install
   ```

2. **Iniciar base de datos local:**
   ```bash
   # On Windows
   start-local-db.bat

   # On Linux/Mac
   ./start-local-db.sh

   # Or manually
   docker compose up -d
   ```

3. **La configuración ya está lista:**
   - ✓ `.env` configurado para base de datos local
   - ✓ Schema de base de datos se aplica automáticamente
   - ✓ Frontend configurado para conectarse al API local

### Database Setup

**Two database configurations are available:**

1. **Local Development** (Recommended)
   - Uses Docker PostgreSQL container
   - Configuration: `.env.local`
   - See [README-LOCAL-DB.md](README-LOCAL-DB.md) for detailed setup

2. **Production** (Supabase)
   - Cloud-hosted PostgreSQL
   - Configuration: `.env.production`
   - Deployed on Vercel

**To switch between databases:**
```bash
# Use local database (development)
cp .env.local .env

# Use production database (testing)
cp .env.production .env
```

⚠️ **Important**: Never commit `.env` or `.env.production` to git!

## Obtener datos de Instagram

1. En Instagram web, ir a: **Configuración** → **Privacidad** → **Descargar tus datos**
2. Seleccionar "Información de la cuenta"
3. Esperar el correo con el archivo descargable
4. Extraer el ZIP y buscar el archivo `usersNotFollowingBack.json`

## Uso

### Modo desarrollo (con hot-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm run build
npm start
```

### Ejecutar tests:
```bash
npm test
npm run test:watch
npm run test:coverage
```

## Funcionalidades

1. **Cargar JSON de Instagram** - Importa el archivo `usersNotFollowingBack.json`
2. **Ver usernames extraídos** - Visualiza la lista de usuarios que no te siguen
3. **Gestionar whitelist** - Añade usuarios que no quieres rastrear (ej: celebridades)
4. **Insertar a no-seguidores** - Guarda los usuarios en la base de datos
5. **Mover a ex-seguidores** - Marca usuarios que dejaron de seguirte
6. **Ver listas** - Consulta whitelist, no-seguidores y ex-seguidores

## Estructura del Proyecto

```
seguidores/
├── src/                    # Backend (Node.js + TypeScript)
│   ├── config/             # Configuración de base de datos
│   ├── services/           # Lógica de negocio
│   └── index.ts            # CLI principal
├── frontend/               # Frontend (React - Pendiente setup)
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Llamadas API
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilidades
│   ├── README.md           # Documentación frontend
│   └── SETUP_GUIDE.md      # Guía de configuración
├── database/               # Schemas SQL
├── tests/                  # Tests unitarios
├── examples/               # Archivos de ejemplo
└── todo.md                 # Roadmap con EPICs frontend
```

## Stack Tecnológico

### Backend (Completado)
- **Runtime**: Node.js + TypeScript
- **Base de datos**: PostgreSQL (Supabase) con adaptador MySQL-compatible
- **Database Driver**: pg (node-postgres)
- **API**: Express.js REST API
- **Testing**: Jest + ts-jest
- **CLI**: readline (interfaz interactiva)

### Frontend (En desarrollo)
- **Framework**: React + Vite (recomendado) / Next.js / Vue 3
- **Lenguaje**: TypeScript
- **Styling**: TailwindCSS
- **State**: Zustand / Context API
- **HTTP**: Axios
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Testing**: Vitest + React Testing Library

Ver `frontend/SETUP_GUIDE.md` para instrucciones de configuración.

## Próximas Funcionalidades

- Estadísticas de seguidores/unfollowers
- Dashboard web
- Exportación a CSV/Excel
- Análisis histórico# Force redeploy

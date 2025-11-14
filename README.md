# Instagram Follower Tracker

Sistema para rastrear y gestionar seguidores de Instagram que no te siguen de vuelta.

## ✓ Estado del Proyecto

**MVP BACKEND COMPLETADO** ✓ - El sistema backend CLI está completamente funcional y listo para usar.

**FRONTEND EN DESARROLLO** 🚧 - Estructura creada, pendiente de inicialización (ver `frontend/SETUP_GUIDE.md`)

## Requisitos

- Node.js (v16 o superior) ✓
- PostgreSQL Database (Supabase) ✓ - Cloud-hosted PostgreSQL
- npm ✓

## Instalación

### ✓ Ya configurado en este proyecto:

1. ✓ Dependencias instaladas
2. ✓ Base de datos PostgreSQL (Supabase) configurada
3. ✓ Archivo `.env` configurado con credenciales de Supabase

### Para nueva instalación:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar base de datos (Supabase PostgreSQL):**
   ```bash
   # Aplicar schema en Supabase
   psql "postgres://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:5432/postgres?sslmode=require" -f database/schema_postgres.sql
   ```

3. **Configurar variables de entorno:**

   Copiar `.env.example` a `.env` y editar con tus credenciales de Supabase:
   ```
   DATABASE_URL=postgres://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:5432/postgres
   API_PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

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

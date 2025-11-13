Funcionalidad del sistema:
- El usuario cargará un Json extraído del navegador para la web de instagram (archivo: `usersNotFollowingBack.json`).
- El JSON tendrá un formato estandar del cual se busca obtener el "username", pertenecientes a personas que no siguen al usuario.
- El usuario visualizará los datos extraidos del json.
- Estos usuarios pueden recibir distintas acciones:
    1- Pueden ser agregados a una "whitelist" lo cual asegura que estos usuarios seran excluidos en el proximo analisis del json. La idea es que sea usado para personas que asumimos que no nos van a seguir, como celebridades.
    2- Los otros usuarios serán agregados a una lista de "no seguidores" al presionar un boton "insertar datos".
    3- Luego, el usuario podrá agregarlos a una lista de "ex seguidores".
Hasta acá el MVP.
Luego del MVP quiero mostrarle estadisticas al usuario. Cuantos seguidores tiene, cuantos lo han dejado de seguir, etc. Ha desarrollar a futuro. 

Tecnologia a utilizar:
- PostgreSQL (Supabase) - Cloud-hosted database.
- NodeJs.
- Typescript.

## Arquitectura Técnica - MVP + FRONTEND COMPLETADO ✓

### Stack Tecnológico:
- **Backend**: Node.js con TypeScript + Express.js REST API
- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: TailwindCSS con componentes personalizados
- **Routing**: React Router v6
- **Base de datos**: PostgreSQL (Supabase) con adaptador MySQL-compatible
- **Database Driver**: pg (node-postgres) con pool de conexiones
- **Interfaz**:
  - CLI (Command Line Interface) con readline - ✓ Completado
  - Web Application (React SPA) - ✓ Completado
- **Testing**: Jest con ts-jest
- **Herramientas de desarrollo**:
  - ESLint + Prettier para formateo y linting
  - ts-node para desarrollo
  - nodemon para hot-reload del API
  - Vite para desarrollo frontend con HMR

### Estructura del Proyecto:
```
seguidores/
├── src/                         # Backend (Node.js + Express)
│   ├── config/
│   │   └── database.ts          # Configuración de PostgreSQL connection pool (Supabase)
│   ├── services/
│   │   ├── jsonParser.ts        # Parse y extracción de usernames de JSON Instagram
│   │   ├── whitelist.ts         # CRUD para whitelist
│   │   ├── nonFollowers.ts      # CRUD para non-followers (con filtro de whitelist)
│   │   ├── exFollowers.ts       # CRUD para ex-followers (con transacciones)
│   │   └── followerCounts.ts    # CRUD para follower counts tracking
│   ├── controllers/             # API Controllers
│   │   ├── jsonController.ts    # Upload & parse JSON endpoints
│   │   ├── usersController.ts   # Extracted users endpoints
│   │   ├── whitelistController.ts
│   │   ├── nonFollowersController.ts
│   │   ├── exFollowersController.ts
│   │   ├── statsController.ts   # Statistics endpoints
│   │   └── followerCountsController.ts
│   ├── routes/                  # Express routes
│   │   ├── jsonRoutes.ts
│   │   ├── usersRoutes.ts
│   │   ├── whitelistRoutes.ts
│   │   ├── nonFollowersRoutes.ts
│   │   ├── exFollowersRoutes.ts
│   │   ├── statsRoutes.ts
│   │   └── followerCountsRoutes.ts
│   ├── middleware/
│   │   └── errorHandler.ts      # Global error handling
│   ├── server.ts                # Express app configuration
│   ├── app.ts                   # Server startup
│   └── index.ts                 # CLI interface - Entry point
├── frontend/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── index.ts         # Exports centralizados
│   │   ├── pages/               # Páginas de la aplicación
│   │   │   ├── DashboardPage.tsx     # Dashboard con stats y follower count tracking
│   │   │   ├── UploadPage.tsx        # Upload JSON y visualización
│   │   │   ├── WhitelistPage.tsx     # Gestión de whitelist
│   │   │   ├── NonFollowersPage.tsx  # Gestión de non-followers
│   │   │   └── ExFollowersPage.tsx   # Gestión de ex-followers
│   │   ├── services/
│   │   │   ├── api.ts           # Axios client configuration
│   │   │   └── apiService.ts    # API service methods
│   │   ├── hooks/
│   │   │   └── useToast.ts      # Toast notifications hook
│   │   ├── types/
│   │   │   └── api.ts           # TypeScript interfaces
│   │   ├── App.tsx              # React Router setup
│   │   ├── main.tsx             # React entry point
│   │   └── index.css            # TailwindCSS imports
│   ├── public/                  # Static assets
│   ├── index.html
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.js       # TailwindCSS configuration
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── package.json
├── database/
│   └── schema.sql               # Schema de PostgreSQL con 4 tablas e índices
├── migrations/
│   └── add_follower_counts.sql  # Migration para tabla follower_counts
├── examples/
│   └── usersNotFollowingBack.json  # Ejemplo del formato de Instagram JSON
├── tests/
│   ├── jsonParser.test.ts       # Tests para parsing y extracción
│   ├── whitelist.test.ts        # Tests para whitelist service
│   ├── nonFollowers.test.ts     # Tests para non-followers service
│   └── exFollowers.test.ts      # Tests para ex-followers service
├── .env.example                 # Variables de entorno template
├── .eslintrc.json               # Configuración ESLint
├── .prettierrc                  # Configuración Prettier
├── .gitignore                   # Git ignore patterns
├── tsconfig.json                # TypeScript configuration (backend)
├── jest.config.js               # Jest configuration
├── todo.md                      # Lista de tareas del proyecto
└── prd.md                       # Este documento
```

### Formato del JSON de Instagram:
El sistema espera un archivo `usersNotFollowingBack.json` con el siguiente formato:
```json
{
  "relationships_following": [
    {
      "string_list_data": [
        { "value": "username1" }
      ]
    },
    {
      "string_list_data": [
        { "value": "username2" }
      ]
    }
  ]
}
```

Este archivo se puede obtener desde Instagram:
1. Ir a Configuración → Privacidad → Descargar tus datos
2. Seleccionar "Información de la cuenta"
3. Esperar el correo de Instagram con el archivo descargable
4. Buscar el archivo `usersNotFollowingBack.json` dentro del ZIP descargado

Ver `examples/usersNotFollowingBack.json` para un ejemplo completo.

### Base de Datos:
**PostgreSQL (Supabase)** - Cloud-hosted database con las siguientes tablas:

Tablas implementadas con índices para performance:
1. **whitelist**: usuarios excluidos del análisis (celebridades, etc.)
   - id (SERIAL PRIMARY KEY), username (UNIQUE), created_at (TIMESTAMP)
2. **non_followers**: usuarios que no siguen de vuelta
   - id (SERIAL PRIMARY KEY), username (UNIQUE), created_at (TIMESTAMP)
3. **ex_followers**: usuarios que dejaron de seguir
   - id (SERIAL PRIMARY KEY), username (UNIQUE), unfollowed_at (TIMESTAMP)
4. **follower_counts**: seguimiento histórico del conteo de seguidores
   - id (SERIAL PRIMARY KEY), count (INTEGER), recorded_at (TIMESTAMP), created_at (TIMESTAMP)
   - Índice en recorded_at para queries eficientes

**Migración de MySQL a PostgreSQL**: ✓ Completado
- Adaptador de compatibilidad MySQL-to-PostgreSQL implementado
- Conversión automática de placeholders (`?` → `$1, $2...`)
- Conversión de sintaxis (`INSERT IGNORE` → `INSERT ... ON CONFLICT DO NOTHING`)
- Sin cambios necesarios en la capa de servicios gracias al adaptador

### REST API Endpoints:
Base URL: `http://localhost:3000/api`

#### JSON Upload & Users:
- `POST /json/upload` - Upload y parsear JSON de Instagram (multipart/form-data)
- `GET /users/extracted` - Obtener usuarios extraídos del último JSON
- `DELETE /users/extracted` - Limpiar usuarios extraídos

#### Whitelist:
- `GET /whitelist` - Obtener todos los usuarios en whitelist
- `POST /whitelist` - Agregar usuario a whitelist (body: {username})
- `POST /whitelist/bulk` - Agregar múltiples usuarios (body: {usernames: []})
- `GET /whitelist/:username` - Verificar si usuario está en whitelist
- `DELETE /whitelist/:username` - Eliminar usuario de whitelist

#### Non-Followers:
- `GET /non-followers` - Obtener todos los non-followers
- `POST /non-followers` - Insertar non-followers (body: {usernames: []})
- `DELETE /non-followers/:username` - Eliminar non-follower
- `DELETE /non-followers` - Limpiar todos los non-followers

#### Ex-Followers:
- `GET /ex-followers` - Obtener todos los ex-followers
- `POST /ex-followers` - Mover usuario a ex-followers (body: {username})
- `POST /ex-followers/bulk` - Mover múltiples usuarios (body: {usernames: []})
- `DELETE /ex-followers/:username` - Eliminar ex-follower

#### Statistics:
- `GET /stats` - Obtener estadísticas generales (counts + recent ex-followers)

#### Follower Counts:
- `GET /follower-counts?limit=N` - Obtener historial de follower counts
- `GET /follower-counts/latest` - Obtener el registro más reciente
- `POST /follower-counts` - Registrar nuevo conteo (body: {count})
- `DELETE /follower-counts/:id` - Eliminar registro por ID

### Funcionalidades Implementadas:

#### Backend (CLI + REST API):
1. ✓ Carga de JSON de Instagram desde archivo
2. ✓ Extracción de usernames del formato estándar de Instagram
3. ✓ Gestión de whitelist (agregar/eliminar/visualizar)
4. ✓ Inserción de datos a lista de "no seguidores" (filtrando whitelist automáticamente)
5. ✓ Gestión de ex-seguidores (mover desde no seguidores con transacciones)
6. ✓ Seguimiento histórico de conteo de seguidores
7. ✓ Interfaz CLI interactiva con menú de opciones
8. ✓ REST API con Express.js y CORS configurado
9. ✓ Tests unitarios para todas las funcionalidades
10. ✓ Endpoints para todas las operaciones CRUD

#### Frontend (React Web App):
1. ✓ **DashboardPage**: Vista principal con estadísticas
   - Cards con métricas (whitelist, non-followers, ex-followers, total tracked)
   - Input para registrar conteo de seguidores actual
   - Display de 5 registros más recientes de follower counts
   - Lista de ex-followers recientes

2. ✓ **UploadPage**: Carga y procesamiento de JSON
   - Drag & drop para subir archivos JSON
   - Validación de formato y tamaño
   - Tabla paginada de usuarios extraídos
   - Búsqueda en tiempo real
   - Selección múltiple con checkboxes
   - Bulk actions: "Add to Whitelist" y "Insert to Non-Followers"
   - Acción individual: "Add to Whitelist" por usuario

3. ✓ **WhitelistPage**: Gestión completa de whitelist
   - Tabla paginada con búsqueda
   - Modal para agregar usuarios manualmente
   - Modal de confirmación para eliminar
   - Empty states
   - Toast notifications

4. ✓ **NonFollowersPage**: Gestión de non-followers
   - Tabla paginada con sortable columns (username, created_at)
   - Búsqueda en tiempo real
   - Selección múltiple
   - Bulk action: "Move to Ex-Followers" (con transacciones)
   - Acción individual: "Move to Ex-Followers" por usuario
   - Modal de confirmación para bulk actions

5. ✓ **ExFollowersPage**: Gestión de ex-followers
   - Tabla paginada con sortable columns (username, unfollowed_at)
   - Búsqueda en tiempo real
   - Filtro por rango de fechas (From/To)
   - Botón "Clear Filters"
   - Eliminación individual de usuarios
   - Empty states (no data, no results)
   - Contador dinámico con indicador de filtros activos

6. ✓ **DashboardPage (Actualizado con Charts & Export)**: Visualizaciones avanzadas
   - Cards métricas (whitelist, non-followers, ex-followers, total tracked)
   - Follower count tracking con input y display de registros recientes
   - **FollowerEvolutionChart**: Line chart de evolución temporal
     - Responsive design con Recharts
     - Tooltips personalizados con fechas completas
     - Carga de 30 registros para mejor visualización
     - Filtrado por rango de fechas (DateRangeSelector)
   - **DistributionChart**: Pie chart con distribución de usuarios
     - Porcentajes calculados automáticamente
     - Leyenda con contadores
     - Tooltips con información detallada
   - **Export Statistics**: Exportación de datos (CSV/JSON)
     - Descarga automática con timestamp
     - Incluye summary stats, follower history, ex-followers

#### Componentes Reutilizables:
- ✓ Button (4 variants, 3 sizes, loading state)
- ✓ Input (validation, error messages, helper text)
- ✓ FileUpload (drag & drop, validation, preview)
- ✓ Card (customizable padding, hover effects)
- ✓ Table (pagination, sorting, loading states)
- ✓ Modal (multiple sizes, backdrop, animations)
- ✓ Toast (4 types, auto-dismiss)
- ✓ Loading (3 sizes, fullscreen mode)
- ✓ EmptyState (custom icons, action buttons)
- ✓ SearchBar (debounced search, clear button)
- ✓ Layout (responsive con navigation y footer)
- ✓ Navigation (desktop/mobile responsive)
- ✓ FollowerEvolutionChart (line chart con filtros de fecha)
- ✓ DistributionChart (pie chart responsive)
- ✓ DateRangeSelector (selector de rango de fechas)

### Scripts Disponibles:

#### Backend:
- `npm run dev`: CLI con hot-reload (nodemon)
- `npm run dev:api`: API server en desarrollo (http://localhost:3000)
- `npm run build`: Compilar TypeScript
- `npm run start:api`: API server en producción
- `npm test`: Ejecutar tests
- `npm run test:watch`: Ejecutar tests en modo watch
- `npm run test:coverage`: Ejecutar tests con reporte de cobertura
- `npm run type-check`: Verificar tipos TypeScript

#### Frontend:
- `cd frontend && npm run dev`: Frontend en desarrollo (http://localhost:5173)
- `cd frontend && npm run build`: Build de producción
- `cd frontend && npm run preview`: Preview del build de producción

### Desarrollo Local:
Para correr el proyecto completo en desarrollo:

1. **Terminal 1 - API Server**:
   ```bash
   npm run dev:api
   ```
   El servidor API estará disponible en http://localhost:3000

2. **Terminal 2 - Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   La aplicación web estará disponible en http://localhost:5173

3. **Base de datos PostgreSQL (Supabase)** configurada:
   - Host: aws-1-sa-east-1.pooler.supabase.com:5432
   - Base de datos: postgres
   - Conexión: Via `DATABASE_URL` en `.env`
   - SSL: Configurado automáticamente

---

### Próximos Pasos (Features Avanzadas):

#### ✅ Completado:
- ✓ Dashboard visual (web interface)
- ✓ Seguimiento histórico de seguidores
- ✓ Gráficos de evolución temporal (line charts, pie charts)
- ✓ Exportación de datos a CSV/JSON
- ✓ Filtrado por fechas en ex-followers
- ✓ Búsqueda en tiempo real en todas las tablas
- ✓ Tablas paginadas y ordenables
- ✓ Selección múltiple y bulk actions
- ✓ Toast notifications para feedback
- ✓ Modales de confirmación
- ✓ Empty states elegantes
- ✓ Diseño responsive con TailwindCSS

#### 🔄 En Roadmap:
- [ ] Análisis de growth rate y tendencias
- [ ] Exportación a Excel (.xlsx) y PDF
- [ ] Comparación entre períodos de tiempo
- [ ] Sistema de notas por usuario
- [ ] Sistema de categorías/tags
- [ ] Modo dark/light
- [ ] Notificaciones push/email
- [ ] Sincronización automática con Instagram API
- [ ] Autenticación y multi-usuario
- [ ] API documentation con Swagger/OpenAPI
- [ ] Tests E2E con Cypress/Playwright
- [ ] Mobile app (React Native)
- [ ] Scheduled reports

---

### Arquitectura de la Aplicación:

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Components (Button, Table, Modal, Charts, etc.)  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Pages (Dashboard, Upload, Whitelist, etc.)       │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Services (apiService.ts - Axios HTTP Client)     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Node.js + Express)                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Routes (7 routers for different resources)       │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Controllers (Request/Response handling)          │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Services (Business logic + DB operations)        │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Middleware (Error handling, CORS)                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ SQL
                           ▼
┌─────────────────────────────────────────────────────────┐
│         DATABASE (PostgreSQL - Supabase Cloud)           │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Tables: whitelist, non_followers, ex_followers,  │  │
│  │          follower_counts                          │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Indexes for performance optimization             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

### Flujo de Datos Típico:

1. **Upload JSON**:
   - Usuario arrastra archivo JSON en UploadPage
   - FileUpload component valida y envía a backend
   - Backend parsea JSON y extrae usernames
   - Respuesta muestra usuarios en tabla paginada

2. **Add to Whitelist**:
   - Usuario selecciona usuarios en UploadPage o WhitelistPage
   - Frontend envía POST request a `/api/whitelist/bulk`
   - Backend inserta usuarios con `ON CONFLICT DO NOTHING`
   - Toast notification confirma operación

3. **Insert to Non-Followers**:
   - Usuario selecciona usuarios y click "Insert to Non-Followers"
   - Frontend envía POST request a `/api/non-followers`
   - Backend filtra automáticamente usuarios en whitelist
   - Inserta restantes en tabla non_followers
   - Toast muestra cantidad insertada

4. **Move to Ex-Followers**:
   - Usuario selecciona usuarios en NonFollowersPage
   - Frontend envía POST request a `/api/ex-followers/bulk`
   - Backend ejecuta transacción:
     - DELETE de non_followers
     - INSERT a ex_followers
   - Ambas tablas se actualizan atómicamente

5. **View Statistics & Charts**:
   - DashboardPage carga stats via `/api/stats`
   - Line chart carga follower history via `/api/follower-counts?limit=30`
   - Pie chart calcula distribución de usuarios
   - Usuario puede exportar datos a CSV/JSON

---

### Tecnologías y Patrones:

**Backend Patterns**:
- REST API design
- Controller-Service pattern
- Database connection pooling
- Transaction management
- Error handling middleware
- CORS configuration

**Frontend Patterns**:
- Component-based architecture
- Custom hooks (useToast)
- Controlled components
- Pagination & sorting
- Debounced search
- Optimistic UI updates
- Toast notifications for UX

**Database Patterns**:
- Normalized schema (4 tables)
- Indexes for query optimization
- UNIQUE constraints
- Timestamps for audit trail
- ON CONFLICT clauses for idempotency

---

### Variables de Entorno:

**Backend (.env)**:
```env
DATABASE_URL=postgresql://postgres.PROJECT_ID:PASSWORD@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
PORT=3000
```

**Frontend (Vite)**:
- Proxy configurado en `vite.config.ts` para enviar requests a `http://localhost:3000`
- No necesita variables de entorno adicionales en desarrollo

---

### Testing:

**Backend Tests (Jest)**:
- `jsonParser.test.ts` - Parse de JSON Instagram
- `whitelist.test.ts` - CRUD operations whitelist
- `nonFollowers.test.ts` - CRUD operations non-followers
- `exFollowers.test.ts` - CRUD operations ex-followers

**Ejecutar tests**:
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

---

### Deployment Considerations:

**Backend**:
- Build: `npm run build` (compila TypeScript a JavaScript)
- Production: `npm run start:api`
- Environment: Asegurar `DATABASE_URL` y `PORT` en producción
- CORS: Configurar orígenes permitidos para producción

**Frontend**:
- Build: `cd frontend && npm run build`
- Output: `frontend/dist/` (archivos estáticos)
- Deploy: Netlify, Vercel, CloudFlare Pages, etc.
- API URL: Actualizar base URL en producción

**Database**:
- Ya en producción (Supabase)
- Backups automáticos
- SSL habilitado
- Connection pooling configurado

---

### Documentación Adicional:

- **README.md**: Guía de inicio rápido y getting started
- **setup_complete.md**: Overview del setup y estado del proyecto
- **todo.md**: Lista de tareas y roadmap
- **database/schema.sql**: Schema completo de base de datos
- **examples/usersNotFollowingBack.json**: Ejemplo del formato de Instagram

---

**Última actualización**: 2025-01-13
**Versión**: 2.0.0 (MVP + Frontend Completo)
**Estado**: Production Ready
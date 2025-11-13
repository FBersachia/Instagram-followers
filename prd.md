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
- MySQL.
- NodeJs.
- Typescript.

## Arquitectura Técnica - MVP + FRONTEND COMPLETADO ✓

### Stack Tecnológico:
- **Backend**: Node.js con TypeScript + Express.js REST API
- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: TailwindCSS con componentes personalizados
- **Routing**: React Router v6
- **Base de datos**: MySQL con mysql2 (promises)
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
│   │   └── database.ts          # Configuración de MySQL connection pool
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
│   └── schema.sql               # Schema de MySQL con 3 tablas e índices
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
Tablas implementadas con índices para performance:
1. **whitelist**: usuarios excluidos del análisis (celebridades, etc.)
   - id (PK), username (UNIQUE), created_at
2. **non_followers**: usuarios que no siguen de vuelta
   - id (PK), username (UNIQUE), created_at
3. **ex_followers**: usuarios que dejaron de seguir
   - id (PK), username (UNIQUE), unfollowed_at
4. **follower_counts**: seguimiento histórico del conteo de seguidores
   - id (PK), count (INT), recorded_at (DATETIME), created_at (DATETIME)
   - Índice en recorded_at para queries eficientes

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

3. **Base de datos MySQL** debe estar corriendo:
   - Host: 127.0.0.1:3306
   - Usuario: francisco
   - Base de datos: seguidores

### Próximos Pasos (Features Avanzadas):
- ✓ Dashboard visual (web interface) - COMPLETADO
- ✓ Seguimiento histórico de seguidores - COMPLETADO
- ✓ Gráficos de evolución temporal (line charts, pie charts) - COMPLETADO
- ✓ Exportación de datos a CSV/JSON - COMPLETADO
- [ ] Análisis de growth rate y tendencias
- [ ] Exportación a Excel (.xlsx) y PDF
- [ ] Comparación entre períodos de tiempo
- [ ] Sistema de notas por usuario
- [ ] Sistema de categorías/tags
- [ ] Modo dark/light
- [ ] Notificaciones push
- [ ] Sincronización automática con Instagram API 
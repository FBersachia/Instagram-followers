# Services

Servicios para comunicación con la API del backend.

## Estructura

```
services/
├── api.ts                    # Cliente HTTP base
├── whitelist.service.ts      # Endpoints de whitelist
├── nonFollowers.service.ts   # Endpoints de non-followers
├── exFollowers.service.ts    # Endpoints de ex-followers
├── upload.service.ts         # Endpoints de carga de JSON
└── stats.service.ts          # Endpoints de estadísticas
```

## Cliente Base API

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Agregar token si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo centralizado de errores
    if (error.response?.status === 401) {
      // Redirect a login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Ejemplo de Servicio

```typescript
// services/whitelist.service.ts
import api from './api';
import { User } from '@/types/user.types';

export const whitelistService = {
  // Obtener todos los usuarios en whitelist
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/whitelist');
    return response.data;
  },

  // Agregar usuario a whitelist
  add: async (username: string): Promise<void> => {
    await api.post('/whitelist', { username });
  },

  // Eliminar usuario de whitelist
  remove: async (username: string): Promise<void> => {
    await api.delete(`/whitelist/${username}`);
  },

  // Verificar si usuario está en whitelist
  check: async (username: string): Promise<boolean> => {
    const response = await api.get(`/whitelist/${username}/check`);
    return response.data.exists;
  },
};
```

## Endpoints del Backend

### Whitelist
- `GET /api/whitelist` - Obtener whitelist
- `POST /api/whitelist` - Agregar a whitelist
- `DELETE /api/whitelist/:username` - Eliminar de whitelist

### Non-Followers
- `GET /api/non-followers` - Obtener non-followers
- `POST /api/non-followers` - Insertar non-followers
- `DELETE /api/non-followers/:username` - Eliminar

### Ex-Followers
- `GET /api/ex-followers` - Obtener ex-followers
- `POST /api/ex-followers` - Mover a ex-followers
- `DELETE /api/ex-followers/:username` - Eliminar

### Upload
- `POST /api/json/upload` - Subir y parsear JSON
- `GET /api/users/extracted` - Obtener usuarios extraídos

### Stats
- `GET /api/stats` - Obtener estadísticas generales
- `GET /api/stats/timeline` - Evolución temporal
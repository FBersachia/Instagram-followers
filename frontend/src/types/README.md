# Types

Definiciones de tipos TypeScript para toda la aplicación.

## Archivos de Tipos

```
types/
├── index.ts              # Exportaciones centralizadas
├── user.types.ts         # Tipos de usuario
├── api.types.ts          # Tipos de respuestas API
├── stats.types.ts        # Tipos de estadísticas
└── common.types.ts       # Tipos comunes
```

## Ejemplos de Tipos

### User Types

```typescript
// types/user.types.ts

export interface User {
  id?: string;
  username: string;
  full_name?: string;
  profile_pic_url?: string;
  is_verified?: boolean;
  created_at?: string;
}

export interface WhitelistUser extends User {
  created_at: string;
}

export interface NonFollower extends User {
  created_at: string;
}

export interface ExFollower extends User {
  unfollowed_at: string;
}

export type UserStatus = 'whitelist' | 'non_follower' | 'ex_follower';
```

### API Types

```typescript
// types/api.types.ts

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UploadJsonResponse {
  success: boolean;
  usernamesCount: number;
  usernames: string[];
}
```

### Stats Types

```typescript
// types/stats.types.ts

export interface Stats {
  totalFollowers: number;
  totalNonFollowers: number;
  totalExFollowers: number;
  totalWhitelist: number;
  unfollowRate: number;
  lastUpdate: string;
}

export interface TimelineData {
  date: string;
  followers: number;
  nonFollowers: number;
  exFollowers: number;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}
```

### Common Types

```typescript
// types/common.types.ts

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  order: SortOrder;
}

export interface FilterConfig {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: UserStatus[];
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'search';
```

### Index (Exportaciones Centralizadas)

```typescript
// types/index.ts

export * from './user.types';
export * from './api.types';
export * from './stats.types';
export * from './common.types';
```

## Uso de Tipos

```typescript
// Ejemplo de uso en componente
import { User, Stats, ApiResponse } from '@/types';

const MyComponent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchData = async (): Promise<ApiResponse<User>> => {
    // ...
  };
};
```

## Enums

```typescript
// types/enums.ts

export enum UserStatus {
  WHITELIST = 'whitelist',
  NON_FOLLOWER = 'non_follower',
  EX_FOLLOWER = 'ex_follower',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}
```
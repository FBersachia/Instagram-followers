# Utils

Funciones de utilidad y helpers.

## Archivos Recomendados

```
utils/
├── formatters.ts         # Funciones de formateo
├── validators.ts         # Validaciones
├── constants.ts          # Constantes de la app
├── dateUtils.ts          # Utilidades de fechas
└── apiHelpers.ts         # Helpers para API
```

## Formatters

```typescript
// utils/formatters.ts

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-AR').format(num);
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return 'hace unos segundos';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
```

## Validators

```typescript
// utils/validators.ts

export const isValidUsername = (username: string): boolean => {
  const regex = /^[a-zA-Z0-9._]{1,30}$/;
  return regex.test(username);
};

export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const isInstagramJson = (data: any): boolean => {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    'username' in data[0]
  );
};
```

## Constants

```typescript
// utils/constants.ts

export const APP_NAME = 'Instagram Follower Tracker';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  UPLOAD: '/upload',
  WHITELIST: '/whitelist',
  NON_FOLLOWERS: '/non-followers',
  EX_FOLLOWERS: '/ex-followers',
} as const;

export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD de MMMM, YYYY',
  WITH_TIME: 'DD/MM/YYYY HH:mm',
};

export const COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#8B5CF6',
  SUCCESS: '#10B981',
  DANGER: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#0EA5E9',
};
```

## Date Utils

```typescript
// utils/dateUtils.ts

export const getDaysAgo = (date: string | Date): number => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const isToday = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

export const getDateRange = (days: number): { from: Date; to: Date } => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return { from, to };
};
```

## API Helpers

```typescript
// utils/apiHelpers.ts

export const buildQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  return query.toString();
};

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Ha ocurrido un error inesperado';
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
```
# Hooks

Custom React hooks para reutilización de lógica.

## Hooks a Implementar

### useApi
Hook genérico para llamadas API con loading/error states

```typescript
// hooks/useApi.ts
import { useState, useCallback } from 'react';

export function useApi<T>(apiFunc: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiFunc();
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunc]);

  return { data, isLoading, error, execute };
}
```

### useWhitelist
Hook para gestión de whitelist

```typescript
// hooks/useWhitelist.ts
import { useState, useEffect } from 'react';
import { whitelistService } from '@/services/whitelist.service';
import { User } from '@/types/user.types';

export function useWhitelist() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWhitelist = async () => {
    try {
      setIsLoading(true);
      const data = await whitelistService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async (username: string) => {
    await whitelistService.add(username);
    await fetchWhitelist();
  };

  const removeUser = async (username: string) => {
    await whitelistService.remove(username);
    await fetchWhitelist();
  };

  useEffect(() => {
    fetchWhitelist();
  }, []);

  return {
    users,
    isLoading,
    error,
    addUser,
    removeUser,
    refresh: fetchWhitelist,
  };
}
```

### useLocalStorage
Hook para persistencia local

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### useDebounce
Hook para debouncing (búsquedas)

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### useToast
Hook para notificaciones

```typescript
// hooks/useToast.ts
import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const success = useCallback((message: string) => show(message, 'success'), [show]);
  const error = useCallback((message: string) => show(message, 'error'), [show]);
  const info = useCallback((message: string) => show(message, 'info'), [show]);

  return { toasts, success, error, info };
}
```

## Lista de Hooks Recomendados

- `useApi` - Llamadas API genéricas
- `useWhitelist` - Gestión de whitelist
- `useNonFollowers` - Gestión de non-followers
- `useExFollowers` - Gestión de ex-followers
- `useStats` - Estadísticas
- `useLocalStorage` - Persistencia local
- `useDebounce` - Debouncing para búsquedas
- `useToast` - Notificaciones
- `usePagination` - Paginación de tablas
- `useModal` - Control de modales
- `useTheme` - Dark/Light mode
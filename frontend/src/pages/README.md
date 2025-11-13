# Pages

Páginas principales de la aplicación.

## Páginas a Implementar

### 1. Dashboard (`/`)
Página principal con overview de estadísticas

**Características:**
- Cards con métricas principales
- Gráficos de evolución
- Listado de actividad reciente
- Accesos rápidos

### 2. Upload (`/upload`)
Página para cargar JSON de Instagram

**Características:**
- Drag & drop de archivos
- Validación de formato
- Preview de datos extraídos
- Botón para procesar

### 3. Whitelist (`/whitelist`)
Gestión de usuarios en whitelist

**Características:**
- Tabla de usuarios
- Agregar/eliminar usuarios
- Búsqueda y filtros
- Importación bulk

### 4. Non-Followers (`/non-followers`)
Lista de usuarios que no siguen

**Características:**
- Tabla con paginación
- Filtros avanzados
- Selección múltiple
- Mover a ex-followers

### 5. Ex-Followers (`/ex-followers`)
Historial de unfollows

**Características:**
- Tabla ordenable
- Filtro por fechas
- Vista de timeline
- Exportar datos

## Estructura de Página

```tsx
// pages/Dashboard/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/features/StatCard';
import { useStats } from '@/hooks/useStats';

export const Dashboard = () => {
  const { stats, isLoading, error } = useStats();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Layout>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Followers" value={stats.followers} />
        <StatCard title="Non-Followers" value={stats.nonFollowers} />
        <StatCard title="Ex-Followers" value={stats.exFollowers} />
        <StatCard title="Whitelist" value={stats.whitelist} />
      </div>
    </Layout>
  );
};
```
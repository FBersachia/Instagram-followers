# Components

Directorio para componentes reutilizables de React.

## Estructura Recomendada

```
components/
├── common/               # Componentes UI genéricos
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── Button.stories.tsx
│   ├── Input/
│   ├── Card/
│   ├── Modal/
│   └── Table/
├── layout/               # Componentes de estructura
│   ├── Header/
│   ├── Sidebar/
│   ├── Footer/
│   └── Layout/
└── features/             # Componentes específicos
    ├── UserTable/
    ├── StatCard/
    ├── FileUpload/
    └── ChartCard/
```

## Ejemplo de Componente

```tsx
// components/common/Button/Button.tsx
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
```
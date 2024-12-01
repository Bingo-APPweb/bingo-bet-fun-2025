// src/components/ui/spinner.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'white';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
} as const;

const variantClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  white: 'text-white',
} as const;

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  ...props
}) => {
  return (
    <div
      role='status'
      className={cn('inline-block animate-spin', sizeClasses[size], className)}
      {...props}
    >
      <svg
        className={cn('w-full h-full', variantClasses[variant])}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
      <span className='sr-only'>Loading...</span>
    </div>
  );
};

// Skeleton loader para usar em conjunto com o Spinner
export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('animate-pulse space-y-4', className)}>
      <div className='h-4 bg-gray-200 rounded w-3/4' />
      <div className='h-4 bg-gray-200 rounded' />
      <div className='h-4 bg-gray-200 rounded w-5/6' />
    </div>
  );
};

// HOC para adicionar loading state a qualquer componente
export function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  LoadingComponent: React.ComponentType = Spinner
) {
  return function WithLoadingComponent({ isLoading, ...props }: P & { isLoading: boolean }) {
    if (isLoading) {
      return <LoadingComponent />;
    }
    return <WrappedComponent {...(props as P)} />;
  };
}

// Hook para gerenciar estados de loading
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const withLoadingState = React.useCallback(async <T,>(promise: Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      const result = await promise;
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    setIsLoading,
    withLoadingState,
  };
};

// Exemplo de uso:
/*
// Como componente básico
<Spinner size="md" variant="primary" />

// Como skeleton loader
<LoadingSkeleton />

// Como HOC
const LoadingButton = withLoading(Button);
<LoadingButton isLoading={isLoading} onClick={handleClick}>
  Click me
</LoadingButton>

// Com o hook
const MyComponent = () => {
  const { isLoading, withLoadingState } = useLoading();

  const handleClick = async () => {
    await withLoadingState(fetchData());
  };

  return isLoading ? <Spinner /> : <div>Content</div>;
};
*/

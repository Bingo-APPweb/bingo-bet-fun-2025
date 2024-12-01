// src/components/ui/progress.tsx
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

export function Progress({ value = 0, max = 100, className = '', ...props }: ProgressProps) {
  return (
    <div
      className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`}
      {...props}
    >
      <div
        className='h-full bg-primary transition-all'
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  );
}

// src/components/errors/ErrorBoundary.tsx
import React, { Component, ErrorInfo } from 'react';
import { Card } from '@/components/ui/card';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Card className='p-4 bg-red-50 border-red-200'>
          <div className='text-red-600'>
            <h2 className='text-lg font-semibold'>Something went wrong</h2>
            <p>{this.state.error?.message}</p>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

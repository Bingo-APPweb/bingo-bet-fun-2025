// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';

// Providers
import { GameProvider } from '@/stores/GameProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AuthProvider } from '@/stores/AuthProvider';
import { AnalyticsProvider } from '@/stores/AnalyticsProvider';

// Config and styles
import '@/lib/firebase/config';
import '@/styles/globals.css';

// Components
import App from './App';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';

// Types
interface ErrorTrackingConfig {
  enabled: boolean;
  sampleRate: number;
  ignoredErrors: string[];
}

// Configuration
const errorTrackingConfig: ErrorTrackingConfig = {
  enabled: process.env.NODE_ENV === 'production',
  sampleRate: 0.9, // Track 90% of errors
  ignoredErrors: ['ResizeObserver loop limit exceeded'],
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 404s or authentication errors
        if (error?.response?.status === 404 || error?.response?.status === 401) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
      onError: (error: any) => {
        console.error('Mutation error:', error);
        // You could trigger a toast notification here
      },
    },
  },
});

// Error tracking setup
const setupErrorTracking = () => {
  if (!errorTrackingConfig.enabled) return;

  window.addEventListener('unhandledrejection', (event) => {
    if (Math.random() > errorTrackingConfig.sampleRate) return;

    if (errorTrackingConfig.ignoredErrors.some((err) => event.reason?.message?.includes(err))) {
      return;
    }

    console.error('Unhandled promise rejection:', {
      message: event.reason?.message,
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    });
    // Add your error tracking service integration here
  });
};

// Service Worker setup
const setupServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('SW registered:', registration);
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  }
};

// Root element check
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error(
    'Failed to find the root element. Make sure there is a div with id="root" in your HTML.'
  );
}

// Initialize app
const initializeApp = () => {
  setupErrorTracking();
  setupServiceWorker();

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <AnalyticsProvider>
          <AuthProvider>
            <GameProvider>
              <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                  <BrowserRouter>
                    <App />
                    <Toaster />
                  </BrowserRouter>
                </ThemeProvider>
                {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
              </QueryClientProvider>
            </GameProvider>
          </AuthProvider>
        </AnalyticsProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

initializeApp();

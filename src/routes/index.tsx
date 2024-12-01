// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import IntegrationTestDashboard from '@/components/debug/IntegrationTestDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/debug',
    element: <IntegrationTestDashboard />,
  },
]);

// src/app/layout.tsx ou componente principal
import { FirestoreDebugger } from '@/components/FirestoreDebugger';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
export default function Layout({ children }) {
  return (
    <div>
      {children}
      {process.env.NODE_ENV === 'development' && <FirestoreDebugger />}
    </div>
  );
}

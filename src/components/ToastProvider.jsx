'use client';

import { Toaster } from 'react-hot-toast';
import { useSqlStore } from '@/store/sqlStore';

export default function ToastProvider() {
  const theme = useSqlStore((state) => state.theme);

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: theme === 'dark' ? '#0e131f' : '#ffffff',
          color: theme === 'dark' ? '#f3f4f6' : '#111827',
          border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-sans)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: theme === 'dark' ? '#0e131f' : '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#f43f5e',
            secondary: theme === 'dark' ? '#0e131f' : '#ffffff',
          },
        },
      }}
    />
  );
}

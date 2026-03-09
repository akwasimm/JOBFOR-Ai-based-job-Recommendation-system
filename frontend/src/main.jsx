import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/index.jsx';
import './styles/global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

/**
 * Primary React application entry point.
 * Bootstraps the root DOM node and injects the top-level Router provider configurations.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AppRouter />
  </QueryClientProvider>
);

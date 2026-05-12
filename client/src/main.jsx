import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './app/store';
import DeleteEntryProvider from './context/DeleteEntryProvider.jsx';
import './index.css';
import { queryClient } from './queryClient.js';
import SocketProvider from './socket/SocketProvider';

const isDev = import.meta.env.VITE_REACT_ENV === 'development';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <DeleteEntryProvider>
              <HelmetProvider>
                <App />
              </HelmetProvider>
            </DeleteEntryProvider>
          </SocketProvider>
          {isDev && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);

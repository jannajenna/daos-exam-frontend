import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { UserProvider } from './context/UserContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import BudHunter from './BudHunter';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BudHunter />
  </React.StrictMode>
);
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const HomePage       = lazy(() => import('../pages/HomePage'));
const PredictionPage = lazy(() => import('../pages/PredictionPage'));
const ResultsPage    = lazy(() => import('../pages/ResultsPage'));
const DashboardPage  = lazy(() => import('../pages/DashboardPage'));

const Spinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-96">
    <div
      className="animate-spin w-10 h-10 border-4 rounded-full"
      style={{ borderColor: 'var(--color-primary-container)', borderTopColor: 'transparent' }}
    />
  </div>
);

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<MainLayout><Spinner /></MainLayout>}>
      <Routes>
        <Route path="/"          element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/predict"   element={<MainLayout><PredictionPage /></MainLayout>} />
        <Route path="/results"   element={<MainLayout><ResultsPage /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;

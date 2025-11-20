// Main App component with routing
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Login } from '@/pages/Login';
import { Layout } from '@/components/common/Layout';
import { auth } from '@/config/firebase';
import { setSessionToken, removeSessionToken } from '@/utils/auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // User is signed in
        setSessionToken('authenticated');
      } else {
        // User is signed out
        removeSessionToken();
      }
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Show loading screen while checking auth state
  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <div className="text-sm text-[#757285]">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/chats"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chats/:chatId"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/chats" replace />} />
      <Route path="*" element={<Navigate to="/chats" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

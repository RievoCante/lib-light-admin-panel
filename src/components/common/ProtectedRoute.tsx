// Protected route component for authentication
import { Navigate } from 'react-router-dom';
import { auth } from '@/config/firebase';
import { getSessionToken } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check both Firebase Auth and session token
  const isAuth = !!auth.currentUser && !!getSessionToken();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

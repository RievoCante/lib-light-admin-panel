// Authentication utilities for session management
import { auth } from '@/config/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';

const SESSION_TOKEN_KEY = 'admin_session_token';

export function setSessionToken(token: string): void {
  localStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

export function removeSessionToken(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!auth.currentUser && !!getSessionToken();
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
    removeSessionToken();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

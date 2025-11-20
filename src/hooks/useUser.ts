// Hook for real-time user data updates
import { useState, useEffect } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { User, UserDocumentData } from '@/types/user';

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Convert Firestore timestamp to Date
 */
function convertTimestamp(
  timestamp: Timestamp | Date | undefined
): Date | undefined {
  if (!timestamp) return undefined;
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return (timestamp as Timestamp).toDate();
}

/**
 * Real-time hook for user data
 * @param userId - The user ID (Firebase Auth UID)
 * @returns User object, loading state, and error
 */
export function useUser(userId: string | null): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      setError(null);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    try {
      const userRef = doc(db, 'users', userId);

      unsubscribe = onSnapshot(
        userRef,
        snapshot => {
          try {
            if (!snapshot.exists()) {
              setUser(null);
              setLoading(false);
              setError(null);
              return;
            }

            const data = snapshot.data() as UserDocumentData;

            const userData: User = {
              uid: snapshot.id,
              accountNumber: data.accountNumber,
              email: data.email,
              displayName: data.displayName,
              photoUrl: data.photoUrl,
              phoneNumber: data.phoneNumber,
              authProvider: data.authProvider,
              createdAt: convertTimestamp(data.createdAt),
              updatedAt: convertTimestamp(data.updatedAt),
            };

            setUser(userData);
            setLoading(false);
            setError(null);
          } catch (err) {
            const error =
              err instanceof Error
                ? err
                : new Error('Failed to process user data');
            setError(error);
            setLoading(false);
          }
        },
        err => {
          console.error('Error in user snapshot:', err);
          setError(
            err instanceof Error ? err : new Error('Failed to fetch user data')
          );
          setLoading(false);
        }
      );
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Failed to initialize user listener');
      setError(error);
      setLoading(false);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]);

  return { user, loading, error };
}

// Hook for real-time notes updates
import { useState, useEffect } from 'react';
import { onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { getNotesQuery } from '@/services/noteService';
import { convertTimestamp } from '@/services/noteService';
import type { AdminNote } from '@/types/note';

interface UseNotesReturn {
  notes: AdminNote[];
  loading: boolean;
  error: Error | null;
}

export function useNotes(userId: string | null): UseNotesReturn {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    try {
      const q = getNotesQuery(userId);

      unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          try {
            const notesData: AdminNote[] = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                userId: data.userId || userId,
                content: data.content || '',
                createdBy: data.createdBy || '',
                createdAt: convertTimestamp(data.createdAt),
                updatedAt: data.updatedAt
                  ? convertTimestamp(data.updatedAt)
                  : undefined,
              };
            });
            setNotes(notesData);
            setLoading(false);
            setError(null);
          } catch (err) {
            const error =
              err instanceof Error ? err : new Error('Failed to process notes');
            setError(error);
            setLoading(false);
          }
        },
        err => {
          console.error('Error in notes snapshot:', err);
          setError(
            err instanceof Error ? err : new Error('Failed to fetch notes')
          );
          setLoading(false);
        }
      );
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Failed to initialize notes listener');
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

  return { notes, loading, error };
}

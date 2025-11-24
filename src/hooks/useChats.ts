// Hook for real-time chat list updates
import { useState, useEffect } from 'react';
import { onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { getChatsQuery } from '@/services/chatService';
import { convertTimestamp } from '@/services/chatService';
import type { Chat } from '@/types/chat';

interface UseChatsReturn {
  chats: Chat[];
  loading: boolean;
  error: Error | null;
}

export function useChats(): UseChatsReturn {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      const q = getChatsQuery();

      unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          try {
            const chatsData: Chat[] = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                userId: data.userId || doc.id,
                createdAt: convertTimestamp(data.createdAt),
                updatedAt: convertTimestamp(data.updatedAt),
                lastReadAt: data.lastReadAt
                  ? convertTimestamp(data.lastReadAt)
                  : undefined,
                lastMessage: data.lastMessage
                  ? {
                      ...data.lastMessage,
                      timestamp: convertTimestamp(data.lastMessage.timestamp),
                    }
                  : undefined,
              };
            });
            setChats(chatsData);
            setLoading(false);
            setError(null);
          } catch (err) {
            const error =
              err instanceof Error ? err : new Error('Failed to process chats');
            setError(error);
            setLoading(false);
          }
        },
        err => {
          console.error('Error in chat snapshot:', err);
          setError(
            err instanceof Error ? err : new Error('Failed to fetch chats')
          );
          setLoading(false);
        }
      );
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Failed to initialize chat listener');
      setError(error);
      setLoading(false);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { chats, loading, error };
}

// Hook for real-time message updates
import { useState, useEffect } from 'react';
import { onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { getMessagesQuery } from '@/services/messageService';
import { convertTimestamp } from '@/services/messageService';
import type { SupportMessage } from '@/types/chat';

interface UseMessagesReturn {
  messages: SupportMessage[];
  loading: boolean;
  error: Error | null;
}

export function useMessages(chatId: string | null): UseMessagesReturn {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    try {
      const q = getMessagesQuery(chatId);

      unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          try {
            const messagesData: SupportMessage[] = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                chatId: data.chatId || chatId,
                userId: data.userId || '',
                content: data.content || '',
                isFromUser: data.isFromUser ?? true,
                timestamp: convertTimestamp(data.timestamp),
                type: data.type || 'text',
              };
            });
            setMessages(messagesData);
            setLoading(false);
            setError(null);
          } catch (err) {
            const error =
              err instanceof Error
                ? err
                : new Error('Failed to process messages');
            setError(error);
            setLoading(false);
          }
        },
        err => {
          console.error('Error in message snapshot:', err);
          setError(
            err instanceof Error ? err : new Error('Failed to fetch messages')
          );
          setLoading(false);
        }
      );
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Failed to initialize message listener');
      setError(error);
      setLoading(false);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [chatId]);

  return { messages, loading, error };
}

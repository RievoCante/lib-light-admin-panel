// Hook to track which messages have been read per chat
// Now uses Firestore data via chat.lastReadAt field
import { useCallback } from 'react';
import { markChatAsRead as markChatAsReadService } from '@/services/chatService';

export function useReadMessages() {
  // Mark a chat as read in Firestore
  const markChatAsRead = useCallback(async (chatId: string) => {
    await markChatAsReadService(chatId);
  }, []);

  // Get the last read timestamp from chat object
  const getLastReadTimestamp = useCallback(
    (chat: { lastReadAt?: Date } | null): Date | null => {
      return chat?.lastReadAt || null;
    },
    []
  );

  return { markChatAsRead, getLastReadTimestamp };
}

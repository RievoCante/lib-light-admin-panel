// Hook to calculate unread message count for a chat
import { useMemo, useEffect } from 'react';
import { useMessages } from './useMessages';
import { useReadMessages } from './useReadMessages';
import type { Chat } from '@/types/chat';

export function useUnreadCount(chat: Chat | null, isActive: boolean): number {
  const chatId = chat?.id || null;
  const { messages } = useMessages(chatId);
  const { markChatAsRead, getLastReadTimestamp } = useReadMessages();

  // Mark chat as read when it becomes active
  useEffect(() => {
    if (isActive && chatId) {
      markChatAsRead(chatId).catch(error => {
        console.error('Failed to mark chat as read:', error);
      });
    }
  }, [isActive, chatId, markChatAsRead]);

  return useMemo(() => {
    // If chat is currently being viewed, no unread messages
    if (isActive) return 0;

    // If no chat or no messages, no unread messages
    if (!chat || messages.length === 0) return 0;

    const lastReadTimestamp = getLastReadTimestamp(chat);

    // Count consecutive user messages from the end that are unread
    let unreadCount = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];

      // If we have a last read timestamp, only count messages after it
      if (lastReadTimestamp && message.timestamp <= lastReadTimestamp) {
        break;
      }

      if (message.isFromUser) {
        unreadCount++;
      } else {
        // Stop counting when we hit an admin message
        break;
      }
    }

    return unreadCount;
  }, [chat, isActive, messages, getLastReadTimestamp]);
}

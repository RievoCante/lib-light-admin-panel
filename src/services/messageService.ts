// Message service for Firestore operations
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  Query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { updateChatTimestamp } from './chatService';
import type { SupportMessage } from '@/types/chat';

/**
 * Get Firestore query for messages in a chat, sorted by timestamp ascending
 */
export function getMessagesQuery(chatId: string): Query {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    return query(messagesRef, orderBy('timestamp', 'asc'));
  } catch (error) {
    console.error('Error creating messages query:', error);
    throw new Error('Failed to create messages query');
  }
}

/**
 * Send an admin message to a chat
 */
export async function sendAdminMessage(
  chatId: string,
  content: string
): Promise<void> {
  try {
    // Validate input
    if (!chatId || !content.trim()) {
      throw new Error('Chat ID and message content are required');
    }

    // Create message document
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      chatId: chatId,
      userId: 'admin',
      content: content.trim(),
      isFromUser: false,
      type: 'text',
      timestamp: serverTimestamp(),
    });

    // Update parent chat's updatedAt timestamp
    await updateChatTimestamp(chatId);
  } catch (error) {
    console.error('Error sending admin message:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to send message');
  }
}

/**
 * Convert Firestore timestamp to Date
 */
export function convertTimestamp(timestamp: Timestamp | Date): Date {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return timestamp.toDate();
}

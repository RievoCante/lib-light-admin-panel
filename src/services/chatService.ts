// Chat service for Firestore operations
import {
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
  Query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Get Firestore query for all chats, sorted by updatedAt descending
 */
export function getChatsQuery(): Query {
  try {
    const chatsRef = collection(db, 'chats');
    return query(chatsRef, orderBy('updatedAt', 'desc'));
  } catch (error) {
    console.error('Error creating chats query:', error);
    throw new Error('Failed to create chats query');
  }
}

/**
 * Update the chat's updatedAt timestamp
 */
export async function updateChatTimestamp(chatId: string): Promise<void> {
  try {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating chat timestamp:', error);
    throw new Error('Failed to update chat timestamp');
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

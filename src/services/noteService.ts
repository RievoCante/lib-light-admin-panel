// Note service for Firestore operations
import {
  collection,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

const MAX_NOTE_LENGTH = 500;

/**
 * Get Firestore query for notes in a chat, sorted by createdAt descending
 */
export function getNotesQuery(userId: string): Query {
  try {
    const notesRef = collection(db, 'chats', userId, 'notes');
    return query(notesRef, orderBy('createdAt', 'desc'));
  } catch (error) {
    console.error('Error creating notes query:', error);
    throw new Error('Failed to create notes query');
  }
}

/**
 * Create a new admin note
 */
export async function createNote(
  userId: string,
  content: string,
  adminId: string
): Promise<void> {
  try {
    // Validate input
    if (!userId || !content.trim()) {
      throw new Error('User ID and note content are required');
    }

    if (!adminId) {
      throw new Error('Admin ID is required');
    }

    if (content.length > MAX_NOTE_LENGTH) {
      throw new Error(
        `Note content cannot exceed ${MAX_NOTE_LENGTH} characters`
      );
    }

    // Create note document
    const notesRef = collection(db, 'chats', userId, 'notes');
    await addDoc(notesRef, {
      userId: userId,
      content: content.trim(),
      createdBy: adminId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating note:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create note');
  }
}

/**
 * Update an existing admin note
 */
export async function updateNote(
  userId: string,
  noteId: string,
  content: string
): Promise<void> {
  try {
    // Validate input
    if (!userId || !noteId || !content.trim()) {
      throw new Error('User ID, note ID, and note content are required');
    }

    if (content.length > MAX_NOTE_LENGTH) {
      throw new Error(
        `Note content cannot exceed ${MAX_NOTE_LENGTH} characters`
      );
    }

    // Update note document
    const noteRef = doc(db, 'chats', userId, 'notes', noteId);
    await updateDoc(noteRef, {
      content: content.trim(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating note:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update note');
  }
}

/**
 * Delete an admin note
 */
export async function deleteNote(
  userId: string,
  noteId: string
): Promise<void> {
  try {
    // Validate input
    if (!userId || !noteId) {
      throw new Error('User ID and note ID are required');
    }

    // Delete note document
    const noteRef = doc(db, 'chats', userId, 'notes', noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete note');
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

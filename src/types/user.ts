// TypeScript interface for user data matching Firestore schema
import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string; // Document ID (Firebase Auth UID)
  accountNumber?: string; // Format: {last8chars}(C)
  email?: string;
  displayName?: string;
  photoUrl?: string | null;
  phoneNumber?: string | null;
  authProvider?: string; // 'email', 'google', 'phone'
  createdAt?: Date;
  updatedAt?: Date;
}

// Firestore document data (with timestamps)
export interface UserDocumentData {
  accountNumber?: string;
  email?: string;
  displayName?: string;
  photoUrl?: string | null;
  phoneNumber?: string | null;
  authProvider?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}
